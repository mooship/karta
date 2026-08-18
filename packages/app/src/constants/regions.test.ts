import { describe, expect, it } from "vitest";
import { getRegionDefinition, REGIONS } from "./regions";

describe("regions", () => {
  it("defines the gauteng province and south-africa national regions", () => {
    expect(REGIONS).toEqual([
      { id: "gauteng", label: "Gauteng", kind: "province" },
      { id: "south-africa", label: "South Africa", kind: "national" },
    ]);
  });

  it("looks up a region by id", () => {
    expect(getRegionDefinition("gauteng")?.label).toBe("Gauteng");
    expect(getRegionDefinition("south-africa")?.kind).toBe("national");
    expect(getRegionDefinition("not-a-real-region")).toBeUndefined();
  });
});
