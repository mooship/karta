import { describe, expect, it } from "vitest";
import { getMetroDefinition, METROS } from "./metros";
import { REGIONS } from "./regions";

describe("metros", () => {
  it("defines all Gauteng municipalities and City of Cape Town with stable Census 2011 municipality codes", () => {
    expect(METROS).toHaveLength(10);
    expect(getMetroDefinition("tshwane").municipalityCodes).toEqual([799]);
    expect(getMetroDefinition("johannesburg").municipalityCodes).toEqual([798]);
    expect(getMetroDefinition("ekurhuleni").municipalityCodes).toEqual([797]);
    expect(getMetroDefinition("emfuleni").municipalityCodes).toEqual([760]);
    expect(getMetroDefinition("midvaal").municipalityCodes).toEqual([761]);
    expect(getMetroDefinition("lesedi").municipalityCodes).toEqual([762]);
    expect(getMetroDefinition("mogale-city").municipalityCodes).toEqual([763]);
    expect(getMetroDefinition("rand-west-city").municipalityCodes).toEqual([
      764, 765,
    ]);
    expect(getMetroDefinition("merafong-city").municipalityCodes).toEqual([
      766,
    ]);
    expect(getMetroDefinition("cape-town").municipalityCodes).toEqual([199]);
  });

  it("assigns every Gauteng metro to the gauteng region and Cape Town to western-cape", () => {
    for (const metro of METROS) {
      if (metro.id === "cape-town") {
        expect(metro.regionId).toBe("western-cape");
      } else {
        expect(metro.regionId).toBe("gauteng");
      }
    }
  });

  it("only assigns metros to regions that actually exist in REGIONS", () => {
    const regionIds = REGIONS.map((region) => region.id);
    for (const metro of METROS) {
      expect(regionIds).toContain(metro.regionId);
    }
  });

  it("throws for an unknown metro id", () => {
    // @ts-expect-error deliberately invalid id for the runtime guard
    expect(() => getMetroDefinition("durban")).toThrow(/Unknown metro id/);
  });
});
