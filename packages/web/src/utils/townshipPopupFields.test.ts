import { afterEach, describe, expect, it, vi } from "vitest";

const { getLocale } = vi.hoisted(() => ({
  getLocale: vi.fn(() => "en"),
}));

vi.mock("../paraglide/runtime.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../paraglide/runtime.js")>();
  return { ...actual, getLocale };
});

import { getTownshipPopupFields } from "./townshipPopupFields";

function fieldByKey(key: string) {
  const field = getTownshipPopupFields().find((f) => f.key === key);
  if (!field) {
    throw new Error(`No field for key "${key}"`);
  }
  return field;
}

describe("getTownshipPopupFields", () => {
  afterEach(() => {
    getLocale.mockReturnValue("en");
  });

  it("formats commuteMinutes via formatCommuteTime, and shows it even when null", () => {
    const field = fieldByKey("commuteMinutes");

    expect(field.hideWhenEmpty).toBe(false);
    expect(field.formatValue?.(62)).toBe("1h 2min");
    expect(field.formatValue?.(null)).toBe("No data");
  });

  it("passes nearestJobCenter through as plain text", () => {
    const field = fieldByKey("nearestJobCenter");

    expect(field.formatValue).toBeUndefined();
    expect(field.numeric).toBeFalsy();
  });

  it("formats population using the active locale's number grouping", () => {
    const field = fieldByKey("population");

    expect(field.formatValue?.(334577)).toBe("334,577");

    getLocale.mockReturnValue("af");
    expect(fieldByKey("population").formatValue?.(334577)).toBe("334 577");
  });

  it("formats distanceKm and nearestTransitKm as a one-decimal km figure", () => {
    expect(fieldByKey("distanceKm").formatValue?.(28.4)).toBe("28.4 km");
    expect(fieldByKey("nearestTransitKm").formatValue?.(4.28)).toBe("4.3 km");

    getLocale.mockReturnValue("af");
    expect(fieldByKey("distanceKm").formatValue?.(28.4)).toBe("28,4 km");
  });
});
