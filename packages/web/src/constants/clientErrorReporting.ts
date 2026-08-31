/**
 * Path of the resource route client-side error reports are POSTed to (see
 * `routes/log-error.ts`). Shared between `clientErrorReporting.ts` (the
 * sender) and that route (the receiver) so the two can't drift apart.
 */
export const CLIENT_ERROR_REPORT_PATH = "/log-error";

/**
 * Maximum length, in UTF-16 code units, allowed for each string field of a
 * client error report. Enforced on both ends: the client truncates to this
 * bound before sending, and the server-side route rejects anything longer —
 * so a malicious or malfunctioning client can't use the endpoint to write
 * unbounded text into Workers Logs.
 */
export const CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH = 2000;

/**
 * Maximum request body size, in bytes, `routes/log-error.ts` accepts before
 * even attempting to parse it as JSON.
 * @remarks A generous bound on top of {@link CLIENT_ERROR_REPORT_MAX_FIELD_LENGTH}:
 *   three fields at that length, each in the worst case a 3-byte-per-code-unit
 *   UTF-8 script, comfortably fit well under this with room for JSON
 *   structure overhead. Checked against the request's `Content-Length`
 *   header before `request.json()` is called, so an oversized payload is
 *   rejected without first being buffered into memory in full.
 */
export const CLIENT_ERROR_REPORT_MAX_BODY_BYTES = 32 * 1024;
