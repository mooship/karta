import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCanHover } from "./useCanHover";

function stubMatchMedia(initialMatches: boolean) {
  let changeListener: (() => void) | undefined;
  let matches = initialMatches;

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    addEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === "change") {
        changeListener = listener;
      }
    }),
    removeEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === "change" && changeListener === listener) {
        changeListener = undefined;
      }
    }),
  };

  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(mediaQueryList));

  return {
    triggerChange(nextMatches: boolean) {
      matches = nextMatches;
      changeListener?.();
    },
    mediaQueryList,
  };
}

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
