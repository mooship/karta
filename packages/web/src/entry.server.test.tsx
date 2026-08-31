import { describe, expect, it, vi } from "vitest";

const renderToReadableStreamMock = vi.fn(
  async (_element: unknown, _options: unknown) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("<html></html>"));
        controller.close();
      },
    }),
);

vi.mock("react-dom/server", () => ({
  renderToReadableStream: renderToReadableStreamMock,
}));

describe("entry.server handleRequest", () => {
  it("sets a Content-Security-Policy header carrying a nonce", async () => {
    const handleRequest = (await import("./entry.server")).default;
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await handleRequest(
      request,
      200,
      new Headers(),
      {} as never,
    );

    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toMatch(/'nonce-[^']+'/);
  });

  it("passes the same nonce to renderToReadableStream's options that it puts in the CSP header", async () => {
    renderToReadableStreamMock.mockClear();
    const handleRequest = (await import("./entry.server")).default;
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await handleRequest(
      request,
      200,
      new Headers(),
      {} as never,
    );

    const headerNonce = response.headers
      .get("Content-Security-Policy")
      ?.match(/'nonce-([^']+)'/)?.[1];
    const renderOptions = renderToReadableStreamMock.mock.calls[0]?.[1] as {
      nonce?: string;
    };

    expect(renderOptions.nonce).toBe(headerNonce);
  });

  it("passes the same nonce as <ServerRouter>'s own nonce prop, which react-router threads to Scripts/ScrollRestoration/its streamed-data script", async () => {
    // renderToReadableStream's own `nonce` option only covers scripts React
    // itself injects — react-router's <Scripts>/<ScrollRestoration> and its
    // streamed-data transfer script are its own components, reached only
    // via a matching nonce prop passed directly to <ServerRouter>.
    renderToReadableStreamMock.mockClear();
    const handleRequest = (await import("./entry.server")).default;
    const request = new Request("https://karta.timothybrits.co.za/");

    const response = await handleRequest(
      request,
      200,
      new Headers(),
      {} as never,
    );

    const headerNonce = response.headers
      .get("Content-Security-Policy")
      ?.match(/'nonce-([^']+)'/)?.[1];
    const serverRouterElement = renderToReadableStreamMock.mock
      .calls[0]?.[0] as {
      props: { nonce?: string };
    };

    expect(serverRouterElement.props.nonce).toBe(headerNonce);
  });

  it("uses a different nonce for each request", async () => {
    const handleRequest = (await import("./entry.server")).default;

    const firstResponse = await handleRequest(
      new Request("https://karta.timothybrits.co.za/"),
      200,
      new Headers(),
      {} as never,
    );
    const secondResponse = await handleRequest(
      new Request("https://karta.timothybrits.co.za/"),
      200,
      new Headers(),
      {} as never,
    );

    expect(firstResponse.headers.get("Content-Security-Policy")).not.toBe(
      secondResponse.headers.get("Content-Security-Policy"),
    );
  });
});
