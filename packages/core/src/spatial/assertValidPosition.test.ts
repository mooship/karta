import { describe, expect, it } from "vitest";
import { assertValidPosition } from "./assertValidPosition";

describe("assertValidPosition", () => {
  it("does not throw for a position with 2 or more coordinates", () => {
    expect(() => assertValidPosition([28, -25], "Point")).not.toThrow();
    expect(() => assertValidPosition([28, -25, 100], "Point")).not.toThrow();
  });

  it("throws using the given label and the actual coordinate count", () => {
    expect(() => assertValidPosition([], "Point")).toThrow(
      "Point must have at least 2 coordinates, got 0",
    );
    expect(() => assertValidPosition([28], "point")).toThrow(
      "point must have at least 2 coordinates, got 1",
    );
  });
});
