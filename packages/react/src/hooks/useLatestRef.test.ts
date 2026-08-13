import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useLatestRef } from "./useLatestRef";

describe("useLatestRef", () => {
  it("returns a ref whose current value matches the value passed on the first render", () => {
    const { result } = renderHook(() => useLatestRef("initial"));

    expect(result.current.current).toBe("initial");
  });

  it("updates .current synchronously on every render, without waiting for an effect", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestRef(value),
      { initialProps: { value: "first" } },
    );

    rerender({ value: "second" });

    expect(result.current.current).toBe("second");
  });

  it("keeps the same ref object identity across re-renders", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useLatestRef(value),
      { initialProps: { value: 1 } },
    );
    const firstRef = result.current;

    rerender({ value: 2 });

    expect(result.current).toBe(firstRef);
  });
});
