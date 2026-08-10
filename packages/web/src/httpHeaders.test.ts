import { describe, expect, it } from "vitest";
import headersFile from "../public/_headers?raw";

function findCacheControl(block: string): string | undefined {
  return block
    .split("\n")
    .find((line) => line.trim().startsWith("Cache-Control:"));
}

describe("public/_headers", () => {
  it("allows location search to reach Nominatim under the CSP connect-src directive", () => {
    const cspLine = headersFile
      .split("\n")
      .find((line) => line.includes("Content-Security-Policy:"));
    const connectSrc = cspLine?.match(/connect-src ([^;]+)/)?.[1] ?? "";

    expect(connectSrc).toContain("https://nominatim.openstreetmap.org");
  });

  it("sets a Strict-Transport-Security header on every response", () => {
    const globalBlock = headersFile.split(/\n\/(?!\*\s*$)/)[0] ?? "";

    expect(globalBlock).toMatch(/Strict-Transport-Security:\s*max-age=\d+/);
  });

  it("caches /data/* longer than the previous 5-minute window", () => {
    const dataBlock = headersFile.split(/\n\/data\/\*\n/)[1] ?? "";
    const cacheControl = findCacheControl(dataBlock);
    const maxAge = Number(cacheControl?.match(/max-age=(\d+)/)?.[1] ?? 0);

    expect(maxAge).toBeGreaterThan(300);
  });
});
