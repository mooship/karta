import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWithTimeout } from "./httpUtils";

describe("fetchWithTimeout", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("resolves with the fetch response when it settles before the timeout", async () => {
    const response = new Response("ok");
    const fetchSpy = vi.fn().mockResolvedValue(response);
    vi.stubGlobal("fetch", fetchSpy);

    const result = await fetchWithTimeout("https://example.test", {}, 1000);

    expect(result).toBe(response);
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.test",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("forwards the given options alongside the internal abort signal", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response("ok"));
    vi.stubGlobal("fetch", fetchSpy);

    await fetchWithTimeout(
      "https://example.test",
      { method: "POST", body: "data=1" },
      1000,
    );

    expect(fetchSpy).toHaveBeenCalledWith("https://example.test", {
      method: "POST",
      body: "data=1",
      signal: expect.any(AbortSignal),
    });
  });

  it("aborts and rejects once the timeout elapses without a response", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.fn(
      (_url: string, options: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options.signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        }),
    );
    vi.stubGlobal("fetch", fetchSpy);

    const pending = fetchWithTimeout("https://example.test", {}, 1000);
    const assertion = expect(pending).rejects.toMatchObject({
      name: "AbortError",
    });
    await vi.advanceTimersByTimeAsync(1000);
    await assertion;
  });

  it("clears the timeout once fetch settles, so it never fires afterwards", async () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("ok")));

    await fetchWithTimeout("https://example.test", {}, 1000);

    expect(clearSpy).toHaveBeenCalled();
  });
});
