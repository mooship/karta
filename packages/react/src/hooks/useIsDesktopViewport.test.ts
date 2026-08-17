import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  getViewportWidth,
  MOBILE_BREAKPOINT_PX,
  useIsDesktopViewport,
} from "./useIsDesktopViewport";

function setInnerWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: width,
  });
}

describe("useIsDesktopViewport", () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    setInnerWidth(originalInnerWidth);
  });

  it("is true above the breakpoint", () => {
    setInnerWidth(1024);
    const { result } = renderHook(() => useIsDesktopViewport());

    expect(result.current).toBe(true);
  });

  it("is false below the breakpoint", () => {
    setInnerWidth(375);
    const { result } = renderHook(() => useIsDesktopViewport());

    expect(result.current).toBe(false);
  });

  it("is false exactly at the breakpoint", () => {
    setInnerWidth(MOBILE_BREAKPOINT_PX);
    const { result } = renderHook(() => useIsDesktopViewport());

    expect(result.current).toBe(false);
  });
});

describe("getViewportWidth", () => {
  it("returns window.innerWidth on the client", () => {
    const original = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1024,
    });

    expect(getViewportWidth()).toBe(1024);

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: original,
    });
  });
});

describe("MOBILE_BREAKPOINT_PX", () => {
  it("matches the value getViewportWidth falls back to on the server", () => {
    expect(MOBILE_BREAKPOINT_PX).toBe(768);
  });
});
