import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "./securityHeaders";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HEADERS_FILE_PATH = resolve(__dirname, "../../public/_headers");

/**
 * Parses `public/_headers`' leading `/*` block (Cloudflare's `_headers`
 * format: a path line, then indented `Name: value` lines) into a plain
 * header/value record, stopping at the first blank line or new path block.
 */
function parseGlobalHeadersBlock(fileContent: string): Record<string, string> {
  const lines = fileContent.split("\n");
  const headers: Record<string, string> = {};
  let inGlobalBlock = false;

  for (const line of lines) {
    if (line.trim() === "/*") {
      inGlobalBlock = true;
      continue;
    }
    if (!inGlobalBlock) {
      continue;
    }
    if (line.trim() === "" || !line.startsWith("  ")) {
      break;
    }
    const separatorIndex = line.indexOf(":");
    const name = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    headers[name] = value;
  }

  return headers;
}

/**
 * Guards against `public/_headers` and `SECURITY_HEADERS` drifting apart —
 * see `securityHeaders.ts`'s own comment for why both exist. `_headers`
 * covers static asset responses; `SECURITY_HEADERS` is applied by hand in
 * `workers/app.ts` for this app's SSR-rendered responses, which `_headers`
 * doesn't reach.
 */
describe("SECURITY_HEADERS stays in sync with public/_headers", () => {
  it("matches every header/value pair in _headers' global block", () => {
    const fileContent = readFileSync(HEADERS_FILE_PATH, "utf8");
    const parsedHeaders = parseGlobalHeadersBlock(fileContent);

    expect(parsedHeaders).toEqual(SECURITY_HEADERS);
  });
});
