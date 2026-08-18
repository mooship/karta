import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUsageBeacon } from "./useUsageBeacon";

interface ToggleEvent {
  layerId: string;
  visible: boolean;
}

describe("useUsageBeacon", () => {
  let sendBeacon: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    sendBeacon = vi.fn(() => true);
    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      value: sendBeacon,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("does not send anything before the flush delay elapses", () => {
    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("sends exactly {events: [...]} with only the given event fields, after the flush delay", () => {
    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [endpoint, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(endpoint).toBe("/api/layer-usage");
    expect(JSON.parse(body)).toEqual({
      events: [{ layerId: "townships", visible: true }],
    });
  });

  it("collapses rapid toggles of the same key into a single event with the latest value", () => {
    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.send({ layerId: "townships", visible: false });
    });
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.send({ layerId: "townships", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(JSON.parse(body)).toEqual({
      events: [{ layerId: "townships", visible: true }],
    });
  });

  it("batches distinct keys into one flush", () => {
    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
      result.current.send({ layerId: "rapid-rail", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [, body] = sendBeacon.mock.calls[0] as [string, string];
    expect(JSON.parse(body).events).toHaveLength(2);
  });

  it("starts a fresh buffer after each flush", () => {
    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    act(() => {
      result.current.send({ layerId: "rapid-rail", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sendBeacon).toHaveBeenCalledTimes(2);
    const [, secondBody] = sendBeacon.mock.calls[1] as [string, string];
    expect(JSON.parse(secondBody)).toEqual({
      events: [{ layerId: "rapid-rail", visible: true }],
    });
  });

  it("falls back to fetch with keepalive when sendBeacon is unavailable", () => {
    Object.defineProperty(navigator, "sendBeacon", {
      configurable: true,
      value: undefined,
    });
    const fetchMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [endpoint, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(endpoint).toBe("/api/layer-usage");
    expect(init.method).toBe("POST");
    expect(init.keepalive).toBe(true);
    expect(JSON.parse(init.body as string)).toEqual({
      events: [{ layerId: "townships", visible: true }],
    });
  });

  it("falls back to fetch when sendBeacon reports failure", () => {
    sendBeacon.mockReturnValue(false);
    const fetchMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("flushes any pending buffered events when the page is hidden, without waiting for the delay", () => {
    const { result } = renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 5000,
      }),
    );

    act(() => {
      result.current.send({ layerId: "townships", visible: true });
    });

    expect(sendBeacon).not.toHaveBeenCalled();

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(sendBeacon).toHaveBeenCalledTimes(1);
  });

  it("does not send anything when the page is hidden with nothing buffered", () => {
    renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("does not send anything if the buffer is empty when the flush delay elapses", () => {
    renderHook(() =>
      useUsageBeacon<ToggleEvent>({
        endpoint: "/api/layer-usage",
        dedupeKey: (event) => event.layerId,
        flushDelayMs: 1000,
      }),
    );

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(sendBeacon).not.toHaveBeenCalled();
  });
});
