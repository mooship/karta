import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useResolvedDarkTheme } from "./useResolvedDarkTheme";
import { setThemePreference } from "./useThemePreference";

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("useResolvedDarkTheme", () => {
  afterEach(() => {
    setThemePreference("system");
    vi.unstubAllGlobals();
  });

  it("resolves to true when the OS prefers dark and preference is system", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useResolvedDarkTheme());

    expect(result.current).toBe(true);
  });

  it("resolves to false when the OS prefers light and preference is system", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useResolvedDarkTheme());

    expect(result.current).toBe(false);
  });

  it("resolves to true for an explicit dark preference regardless of the OS", () => {
    stubMatchMedia(false);
    setThemePreference("dark");
    const { result } = renderHook(() => useResolvedDarkTheme());

    expect(result.current).toBe(true);
  });

  it("resolves to false for an explicit light preference regardless of the OS", () => {
    stubMatchMedia(true);
    setThemePreference("light");
    const { result } = renderHook(() => useResolvedDarkTheme());

    expect(result.current).toBe(false);
  });
});
