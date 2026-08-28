import { describe, expect, it } from "vitest";
import {
  HERITAGE_SITES_DOMAIN,
  SPATIAL_APARTHEID_LEGACY_DOMAIN,
} from "./index";

describe("package entry point", () => {
  it("re-exports every domain, not just the one wired into packages/web", () => {
    expect(SPATIAL_APARTHEID_LEGACY_DOMAIN.id).toBe("spatial-apartheid-legacy");
    expect(HERITAGE_SITES_DOMAIN.id).toBe("heritage-sites");
  });
});
