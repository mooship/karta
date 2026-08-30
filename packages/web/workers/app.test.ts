import { beforeEach, describe, expect, it, vi } from "vitest";

const requestHandlerMock = vi.fn(async () => new Response("ok"));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    createRequestHandler: () => requestHandlerMock,
  };
});

describe("worker fetch handler", () => {
  beforeEach(() => {
    requestHandlerMock.mockClear();
  });

  it("redirects the old domain to the new domain, preserving path and query", async () => {
    const workerModule = await import("./app");
    const request = new Request(
      "https://buffer-zones.timothybrits.co.za/some/path?query=1",
    );
    const response = await workerModule.default.fetch(request);
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(
      "https://karta.timothybrits.co.za/some/path?query=1",
    );
  });

  it("passes requests on the new domain through to the request handler unchanged", async () => {
    const workerModule = await import("./app");
    const request = new Request("https://karta.timothybrits.co.za/");
    const response = await workerModule.default.fetch(request);
    expect(response.status).toBe(200);
  });

  it("passes the request through to the request handler unmodified", async () => {
    const workerModule = await import("./app");
    const request = new Request("https://karta.timothybrits.co.za/");

    await workerModule.default.fetch(request);

    expect(requestHandlerMock).toHaveBeenCalledTimes(1);
    expect(requestHandlerMock).toHaveBeenCalledWith(request);
  });

  it("logs and returns a 500 if the request handler throws", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    requestHandlerMock.mockRejectedValueOnce(new Error("boom"));
    const workerModule = await import("./app");
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await workerModule.default.fetch(request);

    expect(response.status).toBe(500);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });

  it("applies every SECURITY_HEADERS entry except Content-Security-Policy to the SSR response", async () => {
    const { SECURITY_HEADERS } = await import(
      "../src/constants/securityHeaders"
    );
    const workerModule = await import("./app");
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await workerModule.default.fetch(request);

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (name === "Content-Security-Policy") {
        continue;
      }
      expect(response.headers.get(name)).toBe(value);
    }
  });

  it("does not apply Content-Security-Policy to the SSR response", async () => {
    // CSP is deliberately excluded from the SSR response — see
    // withSecurityHeaders' own comment in app.ts for why (it breaks React
    // Router's streaming hydration scripts and React's inline Suspense
    // fallback style attribute).
    const workerModule = await import("./app");
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await workerModule.default.fetch(request);

    expect(response.headers.get("Content-Security-Policy")).toBeNull();
  });

  it("applies the non-CSP SECURITY_HEADERS even on the 500 fallback response", async () => {
    const { SECURITY_HEADERS } = await import(
      "../src/constants/securityHeaders"
    );
    vi.spyOn(console, "error").mockImplementation(() => {});
    requestHandlerMock.mockRejectedValueOnce(new Error("boom"));
    const workerModule = await import("./app");
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await workerModule.default.fetch(request);

    expect(response.headers.get("X-Content-Type-Options")).toBe(
      SECURITY_HEADERS["X-Content-Type-Options"],
    );
    expect(response.headers.get("Content-Security-Policy")).toBeNull();
    vi.restoreAllMocks();
  });
});
