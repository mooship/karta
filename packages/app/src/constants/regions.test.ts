import { describe, expect, it } from "vitest";
import { REGIONS } from "./regions";

describe("regions", () => {
  it("defines the gauteng and western-cape province regions", () => {
    expect(REGIONS).toEqual([
      { id: "gauteng", label: "Gauteng", kind: "province" },
      { id: "western-cape", label: "Western Cape", kind: "province" },
    ]);
  });
});
