import { describe, expect, it } from "vitest";
import { getProvinceRegionIds, REGIONS } from "./regions";

describe("regions", () => {
  it("defines the gauteng and western-cape province regions", () => {
    expect(REGIONS).toEqual([
      { id: "gauteng", label: "Gauteng", kind: "province" },
      { id: "western-cape", label: "Western Cape", kind: "province" },
    ]);
  });
});

describe("getProvinceRegionIds", () => {
  it("returns the id of every province-kind region in REGIONS", () => {
    expect(getProvinceRegionIds()).toEqual(["gauteng", "western-cape"]);
  });

  it("excludes any non-province-kind region", () => {
    expect(
      getProvinceRegionIds().every(
        (id) => REGIONS.find((region) => region.id === id)?.kind === "province",
      ),
    ).toBe(true);
  });
});
