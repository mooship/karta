import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { isDirectExecution } from "./cliEntry";

// Build paths and URLs from real filesystem paths so the tests behave the same
// on POSIX and Windows (`file:///repo/...` is not a valid file URL on Windows).
const cleanCachePath = resolve("repo", "src", "cleanCache.ts");
const validateOutputPath = resolve("repo", "src", "validateOutput.ts");
const cleanCacheUrl = pathToFileURL(cleanCachePath).href;

describe("isDirectExecution", () => {
  it("returns true when argv[1] resolves to the given module URL", () => {
    expect(isDirectExecution(["node", cleanCachePath], cleanCacheUrl)).toBe(
      true,
    );
  });

  it("returns false when argv[1] resolves to a different module", () => {
    expect(isDirectExecution(["node", validateOutputPath], cleanCacheUrl)).toBe(
      false,
    );
  });

  it("returns false when argv has no command path", () => {
    expect(isDirectExecution(["node"], cleanCacheUrl)).toBe(false);
  });
});
