import { describe, expect, it } from "vitest";
import { getAllKnownLayerIds } from "./knownLayerIds";

describe("getAllKnownLayerIds", () => {
  it("includes layer ids from every registered domain", () => {
    const ids = getAllKnownLayerIds();

    expect(ids).toContain("townships");
    expect(ids).toContain("heritage-sites");
  });

  it("returns no duplicate ids", () => {
    const ids = getAllKnownLayerIds();

    expect(new Set(ids).size).toBe(ids.length);
  });
});
