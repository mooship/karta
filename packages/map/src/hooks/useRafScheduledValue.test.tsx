import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRafScheduledValue } from "./useRafScheduledValue";

describe("useRafScheduledValue", () => {
  it("coalesces multiple schedule() calls within a frame into one setValue call", () => {
    const rafSpy = vi.fn().mockReturnValue(1);
    vi.stubGlobal("requestAnimationFrame", rafSpy);
    const setValue = vi.fn();

    const { result } = renderHook(() => useRafScheduledValue(setValue));
    act(() => {
      result.current.schedule(1);
      result.current.schedule(2);
      result.current.schedule(3);
    });

    expect(rafSpy).toHaveBeenCalledTimes(1);
    expect(setValue).not.toHaveBeenCalled();

    act(() => {
      rafSpy.mock.calls[0]?.[0]?.(0);
    });

    expect(setValue).toHaveBeenCalledTimes(1);
    expect(setValue).toHaveBeenCalledWith(3);

    vi.unstubAllGlobals();
  });

  it("schedules a new frame once the previous one has fired", () => {
    const rafSpy = vi.fn().mockReturnValue(1);
    vi.stubGlobal("requestAnimationFrame", rafSpy);
    const setValue = vi.fn();

    const { result } = renderHook(() => useRafScheduledValue(setValue));
    act(() => {
      result.current.schedule("a");
    });
    act(() => {
      rafSpy.mock.calls[0]?.[0]?.(0);
    });
    act(() => {
      result.current.schedule("b");
    });

    expect(rafSpy).toHaveBeenCalledTimes(2);

    act(() => {
      rafSpy.mock.calls[1]?.[0]?.(0);
    });

    expect(setValue).toHaveBeenNthCalledWith(1, "a");
    expect(setValue).toHaveBeenNthCalledWith(2, "b");

    vi.unstubAllGlobals();
  });

  it("cancel() aborts a pending frame so setValue never runs", () => {
    const cancelSpy = vi.fn();
    vi.stubGlobal("requestAnimationFrame", vi.fn().mockReturnValue(42));
    vi.stubGlobal("cancelAnimationFrame", cancelSpy);
    const setValue = vi.fn();

    const { result } = renderHook(() => useRafScheduledValue(setValue));
    act(() => {
      result.current.schedule(1);
      result.current.cancel();
    });

    expect(cancelSpy).toHaveBeenCalledWith(42);

    vi.unstubAllGlobals();
  });

  it("cancel() is a no-op when nothing is scheduled", () => {
    const cancelSpy = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelSpy);
    const setValue = vi.fn();

    const { result } = renderHook(() => useRafScheduledValue(setValue));
    act(() => {
      result.current.cancel();
    });

    expect(cancelSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("returns stable schedule/cancel references across renders", () => {
    const setValue = vi.fn();
    const { result, rerender } = renderHook(() =>
      useRafScheduledValue(setValue),
    );
    const first = result.current;
    rerender();

    expect(result.current.schedule).toBe(first.schedule);
    expect(result.current.cancel).toBe(first.cancel);
  });
});
