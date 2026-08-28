import { describe, expect, it } from "vitest";
import {
  getRegionPipelineConfig,
  REGION_PIPELINE_CONFIGS,
} from "./regionPipelineConfigs";

describe("REGION_PIPELINE_CONFIGS", () => {
  it("includes the gauteng and western-cape regions", () => {
    expect(REGION_PIPELINE_CONFIGS.map((config) => config.regionId)).toEqual([
      "gauteng",
      "western-cape",
    ]);
  });
});

describe("getRegionPipelineConfig", () => {
  it("returns the matching region's pipeline config", () => {
    expect(getRegionPipelineConfig("gauteng").regionId).toBe("gauteng");
  });

  it("throws for an unregistered region id", () => {
    expect(() => getRegionPipelineConfig("not-a-real-region")).toThrow(
      "No pipeline config registered for region: not-a-real-region",
    );
  });
});
