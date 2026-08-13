import { describe, expect, it } from "vitest";
import { GAUTENG_SPATIAL_LEGACY_DOMAIN, HERITAGE_SITES_DOMAIN } from "./index";

describe("package entry point", () => {
  it("re-exports every domain, not just the one wired into packages/web", () => {
    expect(GAUTENG_SPATIAL_LEGACY_DOMAIN.id).toBe("gauteng-spatial-legacy");
    expect(HERITAGE_SITES_DOMAIN.id).toBe("heritage-sites");
  });
});
