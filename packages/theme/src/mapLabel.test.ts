import { describe, expect, it } from "vitest";
import { mapLabelVars } from "./mapLabel.css";

describe("mapLabelVars", () => {
  it("resolves every leaf to var(--color-map-label-<name>) with no fallback", () => {
    for (const resolved of Object.values(mapLabelVars)) {
      expect(resolved).toMatch(/^var\(--color-map-label-[a-z][a-z0-9-]*\)$/);
    }
  });

  it("resolves each field to its exact documented custom property name", () => {
    expect(mapLabelVars.surface).toBe("var(--color-map-label-surface)");
    expect(mapLabelVars.surfaceSecondary).toBe(
      "var(--color-map-label-surface-secondary)",
    );
    expect(mapLabelVars.outline).toBe("var(--color-map-label-outline)");
    expect(mapLabelVars.text).toBe("var(--color-map-label-text)");
  });
});
