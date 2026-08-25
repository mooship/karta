import {
  CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH,
  CLIENT_ERROR_REPORT_PATH,
} from "./constants/clientErrorReporting";

/** Distinguishes an uncaught script error from an unhandled promise rejection in a report. */
export type ClientErrorSource = "error" | "unhandledrejection";

/** Body POSTed to `/log-error`, matching that route's `clientErrorReportSchema`. */
interface ClientErrorReport {
  message: string;
  stack?: string;
  url: string;
  source: ClientErrorSource;
}

function truncate(value: string): string {
  return value.length > CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH
    ? value.slice(0, CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH)
    : value;
}

/**
 * Reports an uncaught error or unhandled rejection to `/log-error`, so it
 * reaches Cloudflare Workers Logs. Prefers `navigator.sendBeacon` — it
 * queues the send and returns immediately without blocking or being
 * cancelled by page unload, which matters since some of what this reports
 * (an error during navigation, say) can happen moments before the page
 * disappears — falling back to a `fetch` with `keepalive: true` for the
 * rare environment without `sendBeacon`.
 * @remarks Never throws: a failure here must not itself become a second
 *   uncaught error that re-enters `installClientErrorReporting()`'s
 *   listeners and loops.
 */
export function reportClientError(
  error: unknown,
  source: ClientErrorSource,
): void {
  try {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    const report: ClientErrorReport = {
      message: truncate(message),
      stack: stack === undefined ? undefined : truncate(stack),
      url: truncate(window.location.href),
      source,
    };

    const body = JSON.stringify(report);
    const sentViaBeacon =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(
        CLIENT_ERROR_REPORT_PATH,
        new Blob([body], { type: "application/json" }),
      );

    if (!sentViaBeacon) {
      void fetch(CLIENT_ERROR_REPORT_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Reporting must never itself throw — see the `@remarks` above.
  }
}

/**
 * Installs `window` listeners that report uncaught script errors and
 * unhandled promise rejections via `reportClientError`, closing the one gap
 * left by this app's existing server-side error logging (`root.tsx`'s
 * `ErrorBoundary`, `entry.server.tsx`'s `onError`): a client-side JS
 * exception that never touches a React render or the server at all.
 * @remarks Registered without the capture flag, so — matching
 *   `window.onerror`'s own behaviour — this only ever observes script
 *   errors, not resource-load failures (a 404'd tile image, say); those
 *   don't bubble to `window` and would otherwise flood this with noise
 *   unrelated to an actual code fault.
 */
export function installClientErrorReporting(): void {
  window.addEventListener("error", (event) => {
    reportClientError(event.error ?? event.message, "error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportClientError(event.reason, "unhandledrejection");
  });
}
