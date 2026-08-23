import { describe, expect, it } from "vitest";
import { vars } from "./m3.css";

/** Flattens a nested `vars`-shaped object into `{ "color.primary": "var(--md-sys-color-primary)" }` pairs. */
function flatten(
  value: unknown,
  prefix: string[] = [],
): Record<string, string> {
  if (typeof value === "string") {
    return { [prefix.join(".")]: value };
  }
  return Object.assign(
    {},
    ...Object.entries(value as Record<string, unknown>).map(([key, v]) =>
      flatten(v, [...prefix, key]),
    ),
  );
}

describe("vars", () => {
  it("resolves every leaf to var(--<kebab-case-name>) with no fallback", () => {
    for (const [path, resolved] of Object.entries(flatten(vars))) {
      expect(resolved, path).toMatch(/^var\(--[a-z][a-z0-9-]*\)$/);
    }
  });

  it("declares exactly the token groups and counts docs/design-system.md documents", () => {
    const flat = flatten(vars);
    const countIn = (group: string) =>
      Object.keys(flat).filter((path) => path.startsWith(`${group}.`)).length;

    expect(countIn("color")).toBe(38);
    expect(countIn("shape")).toBe(7);
    expect(countIn("elevation")).toBe(3);
    expect(countIn("state")).toBe(3);
    expect(countIn("motion")).toBe(7);
  });

  it("resolves known roles to their exact documented custom property name", () => {
    expect(vars.color.primary).toBe("var(--md-sys-color-primary)");
    expect(vars.color.surfaceContainerHover).toBe(
      "var(--md-sys-color-surface-container-hover)",
    );
    expect(vars.shape.cornerMedium).toBe("var(--md-sys-shape-corner-medium)");
    expect(vars.elevation.shadow2).toBe("var(--md-sys-elevation-shadow-2)");
    expect(vars.state.hover).toBe("var(--state-hover)");
    expect(vars.motion.easeLargeSurface).toBe(
      "var(--motion-ease-large-surface)",
    );
  });
});
