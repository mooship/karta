import { describe, expect, it } from "vitest";
import {
  TRANSIT_OPERATOR_LAYER_NAMES,
  type TransitOperatorLayerName,
} from "./transitLayers";

describe("transitLayers", () => {
  it("lists the per-operator basenames data-pipeline's legacy display rebuild looks up", () => {
    expect(TRANSIT_OPERATOR_LAYER_NAMES).toEqual([
      "gautrain",
      "gautrain-bus",
      "prasa",
      "a-re-yeng",
      "rea-vaya",
    ]);
  });

  it("types TransitOperatorLayerName as exactly one of TRANSIT_OPERATOR_LAYER_NAMES", () => {
    const name: TransitOperatorLayerName = "gautrain";
    expect(TRANSIT_OPERATOR_LAYER_NAMES).toContain(name);

    // @ts-expect-error not one of the configured operator basenames
    const invalid: TransitOperatorLayerName = "not-a-real-operator";
    expect(TRANSIT_OPERATOR_LAYER_NAMES).not.toContain(invalid);
  });

  it("does not overlap with the current gauteng-spatial-legacy transit layer ids", () => {
    const currentLayerIds = [
      "rapid-rail",
      "bus-rapid-transit",
      "commuter-rail",
      "bus",
    ];
    for (const legacyName of TRANSIT_OPERATOR_LAYER_NAMES) {
      expect(currentLayerIds).not.toContain(legacyName);
    }
  });
});
