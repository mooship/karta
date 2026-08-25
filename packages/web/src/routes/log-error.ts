import type { ActionFunctionArgs } from "react-router";
import { z } from "zod";
import { CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH } from "../constants/clientErrorReporting";

/**
 * Shape of a client error report POSTed by `clientErrorReporting.ts`. Every
 * string field is bounded by `CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH` so a
 * malformed or malicious payload can't write unbounded text into Workers
 * Logs.
 */
const clientErrorReportSchema = z.object({
  message: z.string().min(1).max(CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH),
  stack: z.string().max(CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH).optional(),
  url: z.string().max(CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH),
  source: z.enum(["error", "unhandledrejection"]),
});

/**
 * React Router resource route action: the server-side half of client error
 * reporting. Accepts a `POST` from `clientErrorReporting.ts`'s
 * `installClientErrorReporting()`, validates it, and logs it via
 * `console.error` so it reaches Cloudflare Workers Logs the same way
 * server-side rendering errors already do (see `root.tsx`'s `ErrorBoundary`
 * and `entry.server.tsx`'s `onError`) — this is the only place an
 * uncaught client-side error becomes visible outside the visitor's own
 * browser console.
 * @remarks Deliberately stores nothing and returns no body: this app keeps
 *   no server-side database of visitor data (see `PRIVACY.md`), and a
 *   transient log line is the full extent of what this endpoint does.
 */
export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    const report = clientErrorReportSchema.parse(await request.json());
    console.error("[client-error]", report);
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 400 });
  }
}
