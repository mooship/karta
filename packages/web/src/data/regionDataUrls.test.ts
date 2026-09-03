import { getProvinceRegionIds } from "@karta/app";
import { describe, expect, it } from "vitest";
import { buildRegionDataUrls } from "./regionDataUrls";

describe("buildRegionDataUrls", () => {
  it("builds one URL per configured region", () => {
    expect(buildRegionDataUrls("townships.display.v1.geojson")).toEqual([
      "/data/gauteng/townships.display.v1.geojson",
      "/data/western-cape/townships.display.v1.geojson",
    ]);
  });

  it("builds exactly one URL per province-kind region in REGIONS", () => {
    expect(buildRegionDataUrls("townships.display.v1.geojson")).toHaveLength(
      getProvinceRegionIds().length,
    );
  });
});
