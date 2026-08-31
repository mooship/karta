import type { ActionFunctionArgs } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CLIENT_ERROR_REPORT_MAX_BODY_BYTES,
  CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH,
} from "../constants/clientErrorReporting";
import { action } from "./log-error";

/**
 * Builds a minimal request-like object for `action()`, rather than a real
 * `Request`: happy-dom's `Request`/`Headers` polyfill (this project's
 * default test environment) silently strips "forbidden" request headers —
 * `Origin` and `Content-Length` among them — the same way a real browser's
 * own `fetch()` would for an *outgoing* request. That's the wrong
 * restriction here: this route reads headers off an *incoming* request as
 * a server receives them over the wire, where no such stripping happens.
 */
function makeRequest(
  body: unknown,
  method = "POST",
  rawBody?: string,
  headers?: Record<string, string>,
): ActionFunctionArgs {
  const headerMap = new Map(
    Object.entries({ "Content-Type": "application/json", ...headers }).map(
      ([name, value]) => [name.toLowerCase(), value],
    ),
  );
  const request = {
    method,
    headers: {
      get: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
    },
    json: async () => JSON.parse(rawBody ?? JSON.stringify(body)),
  } as unknown as Request;
  return { request, params: {}, context: {} } as ActionFunctionArgs;
}

const VALID_REPORT = {
  message: "boom",
  url: "https://karta.timothybrits.co.za/",
  source: "error",
} as const;

describe("/log-error route action", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs a valid client error report and responds 204", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(
      makeRequest({
        message: "boom",
        stack: "Error: boom\n at foo",
        url: "https://karta.timothybrits.co.za/",
        source: "error",
      }),
    );

    expect(response.status).toBe(204);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("accepts a report with no stack", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(
      makeRequest({
        message: "boom",
        url: "https://karta.timothybrits.co.za/",
        source: "unhandledrejection",
      }),
    );

    expect(response.status).toBe(204);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["a malformed payload", { message: 123 }, undefined],
    ["a body that isn't valid JSON", undefined, "not json"],
    [
      "a field longer than the maximum length",
      {
        message: "x".repeat(CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH + 1),
        url: "https://karta.timothybrits.co.za/",
        source: "error",
      },
      undefined,
    ],
  ] as const)("rejects %s without logging", async (_case, body, rawBody) => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(makeRequest(body, "POST", rawBody));

    expect(response.status).toBe(400);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("rejects non-POST methods", async () => {
    const response = await action(makeRequest(undefined, "GET"));

    expect(response.status).toBe(405);
  });

  it("accepts a same-origin request with a matching Origin header", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await action(
      makeRequest(VALID_REPORT, "POST", undefined, {
        Origin: "https://karta.timothybrits.co.za",
      }),
    );

    expect(response.status).toBe(204);
  });

  it("accepts a request with no Origin header at all", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await action(makeRequest(VALID_REPORT));

    expect(response.status).toBe(204);
  });

  it("rejects a request from a mismatched Origin without logging", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(
      makeRequest(VALID_REPORT, "POST", undefined, {
        Origin: "https://evil.example.com",
      }),
    );

    expect(response.status).toBe(403);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("rejects a request whose Content-Length exceeds the maximum body size, without parsing it", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const response = await action(
      makeRequest(VALID_REPORT, "POST", undefined, {
        "Content-Length": String(CLIENT_ERROR_REPORT_MAX_BODY_BYTES + 1),
      }),
    );

    expect(response.status).toBe(413);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("accepts a request whose Content-Length is within the maximum body size", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await action(
      makeRequest(VALID_REPORT, "POST", undefined, {
        "Content-Length": String(CLIENT_ERROR_REPORT_MAX_BODY_BYTES),
      }),
    );

    expect(response.status).toBe(204);
  });
});
