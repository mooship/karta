import { describe, expect, it } from "vitest";
import { partitionSettled } from "./partitionSettled";

describe("partitionSettled", () => {
  it("splits fulfilled values and rejection reasons into separate arrays", () => {
    const error = new Error("network down");
    const results: PromiseSettledResult<number>[] = [
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: error },
      { status: "fulfilled", value: 2 },
    ];

    expect(partitionSettled(results)).toEqual({
      fulfilled: [1, 2],
      rejected: [error],
    });
  });

  it("returns empty arrays for an empty input", () => {
    expect(partitionSettled([])).toEqual({ fulfilled: [], rejected: [] });
  });

  it("returns every fulfilled value when nothing rejected", () => {
    const results: PromiseSettledResult<string>[] = [
      { status: "fulfilled", value: "a" },
      { status: "fulfilled", value: "b" },
    ];

    expect(partitionSettled(results)).toEqual({
      fulfilled: ["a", "b"],
      rejected: [],
    });
  });

  it("returns every rejection reason when nothing fulfilled", () => {
    const results: PromiseSettledResult<string>[] = [
      { status: "rejected", reason: "first" },
      { status: "rejected", reason: "second" },
    ];

    expect(partitionSettled(results)).toEqual({
      fulfilled: [],
      rejected: ["first", "second"],
    });
  });
});
