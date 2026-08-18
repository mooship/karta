import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLayerUsageBeacon } from "./useLayerUsageBeacon";

function setNavigatorProperty(name: string, value: unknown) {
  Object.defineProperty(navigator, name, { configurable: true, value });
}

describe("useLayerUsageBeacon", () => {
  let sendBeacon: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    sendBeacon = vi.fn(() => true);
    setNavigatorProperty("sendBeacon", sendBeacon);
    setNavigatorProperty("doNotTrack", undefined);
    setNavigatorProperty("globalPrivacyControl", undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("toggles the layer via the given toggleLayer function", () => {
    const toggleLayer = vi.fn();
    const { result } = renderHook(() =>
      useLayerUsageBeacon({ visibleLayerIds: [], toggleLayer }),
    );

    act(() => {
      result.current("townships");
    });

    expect(toggleLayer).toHaveBeenCalledWith("townships");
  });

  it("reports visible:true when toggling a currently-hidden layer on", () => {
    const { result } = renderHook(() =>
      useLayerUsageBeacon({ visibleLayerIds: [], toggleLayer: vi.fn() }),
    );

    act(() => {
      result.current("townships");
      vi.runAllTimers();
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(JSON.parse(body)).toEqual({
      events: [{ layerId: "townships", visible: true }],
    });
  });

  it("reports visible:false when toggling a currently-visible layer off", () => {
    const { result } = renderHook(() =>
      useLayerUsageBeacon({
        visibleLayerIds: ["townships"],
        toggleLayer: vi.fn(),
      }),
    );

    act(() => {
      result.current("townships");
      vi.runAllTimers();
    });

    const [, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(JSON.parse(body)).toEqual({
      events: [{ layerId: "townships", visible: false }],
    });
  });

  it("still toggles the layer, but sends no beacon, when Do Not Track is enabled", () => {
    setNavigatorProperty("doNotTrack", "1");
    const toggleLayer = vi.fn();
    const { result } = renderHook(() =>
      useLayerUsageBeacon({ visibleLayerIds: [], toggleLayer }),
    );

    act(() => {
      result.current("townships");
      vi.runAllTimers();
    });

    expect(toggleLayer).toHaveBeenCalledWith("townships");
    expect(sendBeacon).not.toHaveBeenCalled();
  });
});
