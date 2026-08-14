import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stubMatchMedia } from "./stubMatchMedia";
import { useCanHover } from "./useCanHover";

describe("useCanHover", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reflects the current matchMedia value", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useCanHover());

    expect(result.current).toBe(true);
  });

  it("is false when the pointer can't hover", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useCanHover());

    expect(result.current).toBe(false);
  });

  it("updates when the media query change event fires", () => {
    const { triggerChange } = stubMatchMedia(false);
    const { result } = renderHook(() => useCanHover());

    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });
});
