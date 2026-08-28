import { describe, expect, it } from "vitest";
import { computeSpatialBurdenScore } from "./spatialBurden";

describe("computeSpatialBurdenScore", () => {
  it("combines both metrics using the default 60/40 commute/transit weighting", () => {
    // commute: 45 / 90 = 0.5, transit: 5 / 10 = 0.5 -> 0.5*0.6 + 0.5*0.4 = 0.5
    expect(computeSpatialBurdenScore(45, 5)).toBeCloseTo(0.5);
  });

  it("weights commute time more heavily than transit distance by default", () => {
    // commute maxed out (90min -> 1.0), transit at zero (0km -> 0.0)
    const commuteHeavy = computeSpatialBurdenScore(90, 0);
    // transit maxed out (10km -> 1.0), commute at zero (0min -> 0.0)
    const transitHeavy = computeSpatialBurdenScore(0, 10);

    expect(commuteHeavy).toBeCloseTo(0.6);
    expect(transitHeavy).toBeCloseTo(0.4);
    expect(commuteHeavy).toBeGreaterThan(transitHeavy as number);
  });

  it("accepts custom weights", () => {
    const score = computeSpatialBurdenScore(90, 10, {
      commuteWeight: 0.5,
      transitWeight: 0.5,
    });
    expect(score).toBeCloseTo(1);
  });

  it("falls back to the transit-only normalized value when commute time is unknown", () => {
    expect(computeSpatialBurdenScore(null, 5)).toBeCloseTo(0.5);
  });

  it("falls back to the commute-only normalized value when transit distance is unknown", () => {
    expect(computeSpatialBurdenScore(45, null)).toBeCloseTo(0.5);
  });

  it("returns null when both metrics are unknown", () => {
    expect(computeSpatialBurdenScore(null, null)).toBeNull();
  });

  it("clamps commute minutes above the normalization bound to 1.0", () => {
    expect(computeSpatialBurdenScore(9000, 0)).toBeCloseTo(0.6);
  });

  it("clamps transit distance above the normalization bound to 1.0", () => {
    expect(computeSpatialBurdenScore(0, 9000)).toBeCloseTo(0.4);
  });

  it("clamps a negative input to 0", () => {
    expect(computeSpatialBurdenScore(-10, -10)).toBeCloseTo(0);
  });

  it("is monotonically non-decreasing in commute minutes", () => {
    const lower = computeSpatialBurdenScore(20, 5) as number;
    const higher = computeSpatialBurdenScore(60, 5) as number;
    expect(higher).toBeGreaterThan(lower);
  });

  it("is monotonically non-decreasing in transit distance", () => {
    const lower = computeSpatialBurdenScore(20, 1) as number;
    const higher = computeSpatialBurdenScore(20, 6) as number;
    expect(higher).toBeGreaterThan(lower);
  });
});
