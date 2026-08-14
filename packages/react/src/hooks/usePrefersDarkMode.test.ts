import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { stubMatchMedia } from "./stubMatchMedia";
import { usePrefersDarkMode } from "./usePrefersDarkMode";

describe("usePrefersDarkMode", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reflects the current matchMedia value", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => usePrefersDarkMode());

    expect(result.current).toBe(true);
  });

  it("updates when the media query change event fires", () => {
    const { triggerChange } = stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersDarkMode());

    expect(result.current).toBe(false);

    act(() => {
      triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it("unsubscribes from the media query on unmount", () => {
    const { mediaQueryList } = stubMatchMedia(false);
    const { unmount } = renderHook(() => usePrefersDarkMode());

    expect(mediaQueryList.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
