import { beforeEach, describe, expect, it, vi } from "vitest";

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

/**
 * Runs `handleRequest` once against a fresh request and extracts everything
 * these tests check: the response itself, the nonce embedded in its CSP
 * header, and the two places that nonce must also reach — the `nonce`
 * option `renderToReadableStream` was called with, and the `nonce` prop on
 * the `<ServerRouter>` element passed to it.
 */
async function handleOnce() {
  const handleRequest = (await import("./entry.server")).default;
  const response = await handleRequest(
    new Request("https://karta.timothybrits.co.za/"),
    200,
    new Headers(),
    {} as never,
  );

  const headerNonce = response.headers
    .get("Content-Security-Policy")
    ?.match(/'nonce-([^']+)'/)?.[1];
  const lastCall =
    renderToReadableStreamMock.mock.calls[
      renderToReadableStreamMock.mock.calls.length - 1
    ];
  const serverRouterElement = lastCall?.[0] as { props: { nonce?: string } };
  const renderOptions = lastCall?.[1] as { nonce?: string };

  return { response, headerNonce, renderOptions, serverRouterElement };
}

describe("entry.server handleRequest", () => {
  beforeEach(() => {
    renderToReadableStreamMock.mockClear();
  });

  it("sets a Content-Security-Policy header carrying a nonce", async () => {
    const { response } = await handleOnce();

    expect(response.headers.get("Content-Security-Policy")).toMatch(
      /'nonce-[^']+'/,
    );
  });

  it("passes the same nonce to renderToReadableStream's options that it puts in the CSP header", async () => {
    const { headerNonce, renderOptions } = await handleOnce();

    expect(renderOptions.nonce).toBe(headerNonce);
  });

  it("passes the same nonce as <ServerRouter>'s own nonce prop, which react-router threads to Scripts/ScrollRestoration/its streamed-data script", async () => {
    // renderToReadableStream's own `nonce` option only covers scripts React
    // itself injects — react-router's <Scripts>/<ScrollRestoration> and its
    // streamed-data transfer script are its own components, reached only
    // via a matching nonce prop passed directly to <ServerRouter>.
    const { headerNonce, serverRouterElement } = await handleOnce();

    expect(serverRouterElement.props.nonce).toBe(headerNonce);
  });

  it("uses a different nonce for each request", async () => {
    const first = await handleOnce();
    const second = await handleOnce();

    expect(first.headerNonce).not.toBe(second.headerNonce);
  });
});
