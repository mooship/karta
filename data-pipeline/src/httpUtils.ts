/**
 * Fetches `url` with an abort-based timeout, aborting and rejecting once
 * `timeoutMs` elapses without a response.
 * @remarks The timeout is cleared as soon as `fetch` settles either way, so
 *   it never fires (or leaks a pending timer) once a response has arrived —
 *   the shared implementation behind every "abort a hung request after N
 *   ms" fetch in this package (Overpass, OSRM, Ekurhuleni IRPTN).
 * @param options - Forwarded to `fetch`; `signal` is set internally and any
 *   `signal` passed here is ignored.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Whether `error` is the `AbortError` `fetchWithTimeout` rejects with once
 * its timeout fires, as opposed to any other fetch failure.
 * @remarks Shared by every adapter that surfaces `fetchWithTimeout`'s abort
 *   as a clearer "timed out after Nms" message (Overpass, OSRM).
 */
export function isAbortError(error: unknown): error is Error {
  return error instanceof Error && error.name === "AbortError";
}
