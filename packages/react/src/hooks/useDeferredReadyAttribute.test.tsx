import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDeferredReadyAttribute } from "./useDeferredReadyAttribute";

describe("useDeferredReadyAttribute", () => {
  function stubRaf() {
    let nextId = 1;
    const callbacks = new Map<number, FrameRequestCallback>();
    const rafSpy = vi.fn((callback: FrameRequestCallback) => {
      const id = nextId++;
      callbacks.set(id, callback);
      return id;
    });
    const cancelSpy = vi.fn((id: number) => {
      callbacks.delete(id);
    });
    vi.stubGlobal("requestAnimationFrame", rafSpy);
    vi.stubGlobal("cancelAnimationFrame", cancelSpy);
    return {
      rafSpy,
      cancelSpy,
      flushNext() {
        const [id, callback] = [...callbacks.entries()][0] ?? [];
        if (id === undefined || !callback) {
          throw new Error("no pending animation frame to flush");
        }
        callbacks.delete(id);
        callback(0);
      },
    };
  }

  it("does not set the attribute until two animation frames have elapsed", () => {
    const { flushNext } = stubRaf();
    const { result } = renderHook(() =>
      useDeferredReadyAttribute("data-ready"),
    );
    const el = document.createElement("div");
    // biome-ignore lint/suspicious/noExplicitAny: assigning a plain ref for the test
    (result.current.ref as any).current = el;

    act(() => {
      result.current.markReadyAfterPaint();
    });
    expect(el.getAttribute("data-ready")).toBeNull();

    act(() => {
      flushNext();
    });
    expect(el.getAttribute("data-ready")).toBeNull();

    act(() => {
      flushNext();
    });
    expect(el.getAttribute("data-ready")).toBe("true");

    vi.unstubAllGlobals();
  });

  it("markNotReady sets the attribute to false synchronously", () => {
    stubRaf();
    const { result } = renderHook(() =>
      useDeferredReadyAttribute("data-ready"),
    );
    const el = document.createElement("div");
    // biome-ignore lint/suspicious/noExplicitAny: assigning a plain ref for the test
    (result.current.ref as any).current = el;

    act(() => {
      result.current.markNotReady();
    });

    expect(el.getAttribute("data-ready")).toBe("false");
    vi.unstubAllGlobals();
  });

  it("markNotReady cancels a pending markReadyAfterPaint so the attribute never flips true", () => {
    const { flushNext, cancelSpy } = stubRaf();
    const { result } = renderHook(() =>
      useDeferredReadyAttribute("data-ready"),
    );
    const el = document.createElement("div");
    // biome-ignore lint/suspicious/noExplicitAny: assigning a plain ref for the test
    (result.current.ref as any).current = el;

    act(() => {
      result.current.markReadyAfterPaint();
    });
    act(() => {
      flushNext();
    });
    act(() => {
      result.current.markNotReady();
    });

    expect(cancelSpy).toHaveBeenCalled();
    expect(el.getAttribute("data-ready")).toBe("false");

    vi.unstubAllGlobals();
  });

  it("returns stable callback references across renders", () => {
    stubRaf();
    const { result, rerender } = renderHook(() =>
      useDeferredReadyAttribute("data-ready"),
    );
    const first = result.current;
    rerender();

    expect(result.current.markNotReady).toBe(first.markNotReady);
    expect(result.current.markReadyAfterPaint).toBe(first.markReadyAfterPaint);

    vi.unstubAllGlobals();
  });
});
