import { describe, expect, it } from "vitest";
import headersFile from "../public/_headers?raw";

/** Isolates one path block (path line plus its indented headers) from `_headers`. */
function getBlock(path: string): string {
  return (
    headersFile.split("\n\n").find((block) => block.startsWith(`${path}\n`)) ??
    ""
  );
}

/** Reads a single header's value out of a block returned by `getBlock`. */
function getHeader(block: string, name: string): string | undefined {
  const line = block.split("\n").find((l) => l.trim().startsWith(`${name}:`));
  return line?.trim().slice(`${name}:`.length).trim();
}

describe("public/_headers", () => {
  it("allows location search to reach Nominatim under the CSP connect-src directive", () => {
    const csp = getHeader(getBlock("/*"), "Content-Security-Policy") ?? "";
    const connectSrc = csp.match(/connect-src ([^;]+)/)?.[1] ?? "";

    expect(connectSrc).toContain("https://nominatim.openstreetmap.org");
  });

  it("sets a Strict-Transport-Security header on every response", () => {
    expect(getBlock("/*")).toMatch(/Strict-Transport-Security:\s*max-age=\d+/);
  });

  it("caches /data/* longer than the previous 5-minute window", () => {
    const cacheControl = getHeader(getBlock("/data/*"), "Cache-Control") ?? "";
    const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1] ?? 0);

    expect(maxAge).toBeGreaterThan(300);
  });
});
