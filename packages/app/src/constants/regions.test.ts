import { describe, expect, it } from "vitest";
import { REGIONS } from "./regions";

describe("regions", () => {
  it("defines the gauteng province region", () => {
    expect(REGIONS).toEqual([
      { id: "gauteng", label: "Gauteng", kind: "province" },
    ]);
  });
});
