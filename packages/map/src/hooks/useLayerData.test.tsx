import { clearFeatureCollectionCache, type DomainConfig } from "@karta/core";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DomainProvider } from "../context/DomainContext";
import { TEST_DOMAIN } from "../testFixtures/domain";
import { useLayerData } from "./useLayerData";

global.fetch = vi.fn();

function withTestDomain({ children }: { children: React.ReactNode }) {
  return <DomainProvider domain={TEST_DOMAIN}>{children}</DomainProvider>;
}

describe("useLayerData", () => {
  beforeEach(() => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ type: "FeatureCollection", features: [] }),
    } as Response);
  });

  afterEach(() => {
    vi.clearAllMocks();
    clearFeatureCollectionCache();
  });

  it("fetches layers when mounted", async () => {
    const { result } = renderHook(() => useLayerData(["rail"]), {
      wrapper: withTestDomain,
    });

    await waitFor(() => {
      expect(result.current.data).toHaveProperty("rail");
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/data/example/rail.display.v1.geojson"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("adds newly requested layers without refetching existing ones", async () => {
    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useLayerData(ids),
      { initialProps: { ids: ["rail"] }, wrapper: withTestDomain },
    );

    await waitFor(() => {
      expect(result.current.data).toHaveProperty("rail");
    });
    vi.clearAllMocks();

    rerender({ ids: ["rail", "bus"] });

    await waitFor(() => {
      expect(result.current.data).toHaveProperty("bus");
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/data/example/bus.display.v1.geojson"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("does not fetch layers that are unavailable", async () => {
    const { result } = renderHook(() => useLayerData(["unavailable-layer"]), {
      wrapper: withTestDomain,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({});
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("retries a failed fetch after a layer is toggled off and on again", async () => {
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ type: "FeatureCollection", features: [] }),
      } as Response);

    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useLayerData(ids),
      { initialProps: { ids: ["rail"] }, wrapper: withTestDomain },
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    expect(result.current.data).toEqual({});
    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });

    rerender({ ids: [] });
    rerender({ ids: ["rail"] });

    await waitFor(() => {
      expect(result.current.data).toHaveProperty("rail");
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result.current.failedLayerIds).toEqual([]);
  });

  it("clears a failed layer id as soon as it's no longer requested, without waiting for a retry", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error("network"));

    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useLayerData(ids),
      { initialProps: { ids: ["rail"] }, wrapper: withTestDomain },
    );

    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });

    rerender({ ids: [] });

    expect(result.current.failedLayerIds).toEqual([]);
  });

  it("logs a failed layer fetch to the console", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const fetchError = new Error("network");
    vi.mocked(global.fetch).mockRejectedValueOnce(fetchError);

    const { result } = renderHook(() => useLayerData(["rail"]), {
      wrapper: withTestDomain,
    });

    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining("rail"),
      fetchError,
    );

    consoleError.mockRestore();
  });

  it("aborts in-flight fetches on unmount", async () => {
    let capturedSignal: AbortSignal | undefined;
    vi.mocked(global.fetch).mockImplementation((_, init) => {
      capturedSignal = (init as RequestInit | undefined)?.signal as
        | AbortSignal
        | undefined;
      return new Promise<Response>(() => {});
    });

    const { unmount } = renderHook(() => useLayerData(["rail"]), {
      wrapper: withTestDomain,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    expect(capturedSignal?.aborted).toBe(false);

    unmount();

    expect(capturedSignal?.aborted).toBe(true);
  });

  it("does not update state when a fetch resolves after unmount", async () => {
    let resolveFetch: (value: Response) => void = () => {};
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        }),
    );

    const { result, unmount } = renderHook(() => useLayerData(["rail"]), {
      wrapper: withTestDomain,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    unmount();
    resolveFetch({
      ok: true,
      json: async () => ({ type: "FeatureCollection", features: [] }),
    } as Response);
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current.data).toEqual({});
  });

  it("does not update failedLayerIds when a fetch rejects after unmount", async () => {
    let rejectFetch: (reason: unknown) => void = () => {};
    vi.mocked(global.fetch).mockImplementation(
      () =>
        new Promise<Response>((_resolve, reject) => {
          rejectFetch = reject;
        }),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result, unmount } = renderHook(() => useLayerData(["rail"]), {
      wrapper: withTestDomain,
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    unmount();
    rejectFetch(new Error("network"));
    await Promise.resolve();
    await Promise.resolve();

    expect(result.current.failedLayerIds).toEqual([]);
    expect(consoleError).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("does not duplicate a layer id in failedLayerIds when its retry also fails", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("network"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useLayerData(ids),
      { initialProps: { ids: ["rail"] }, wrapper: withTestDomain },
    );

    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });

    rerender({ ids: [] });
    // Toggling the layer off (above) now prunes it from failedLayerIds
    // immediately, rather than waiting for a retry -- see the "clears a
    // failed layer id" test above. Re-requesting it here starts a fresh
    // fetch, which this test expects to fail again and be re-added.
    expect(result.current.failedLayerIds).toEqual([]);
    rerender({ ids: ["rail"] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });

    consoleError.mockRestore();
  });

  it("clears a failed layer id on a later success, even when it was never dropped from the requested ids", async () => {
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ type: "FeatureCollection", features: [] }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ type: "FeatureCollection", features: [] }),
      } as Response);

    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useLayerData(ids),
      { initialProps: { ids: ["rail"] }, wrapper: withTestDomain },
    );

    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });

    // Adds "bus" alongside "rail" (never removing "rail" from the requested
    // ids, unlike the toggle-off/on tests above, which clear failedLayerIds
    // early via a different code path) -- "rail"'s own requestKey was
    // dropped from the internal `requested` set on its earlier failure, so
    // this re-triggers its fetch, and this time it succeeds.
    rerender({ ids: ["rail", "bus"] });

    await waitFor(() => {
      expect(result.current.data).toHaveProperty("rail");
    });
    expect(result.current.failedLayerIds).toEqual([]);
  });

  it("keeps a failed layer id exactly once when a later retry (without ever toggling it off) fails again", async () => {
    vi.mocked(global.fetch)
      .mockRejectedValueOnce(new Error("network")) // rail, first attempt
      .mockRejectedValueOnce(new Error("network")) // rail, retry
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ type: "FeatureCollection", features: [] }),
      } as Response); // bus
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const { result, rerender } = renderHook(
      ({ ids }: { ids: string[] }) => useLayerData(ids),
      { initialProps: { ids: ["rail"] }, wrapper: withTestDomain },
    );

    await waitFor(() => {
      expect(result.current.failedLayerIds).toEqual(["rail"]);
    });

    rerender({ ids: ["rail", "bus"] });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });
    await waitFor(() => {
      expect(result.current.data).toHaveProperty("bus");
    });
    expect(result.current.failedLayerIds).toEqual(["rail"]);

    consoleError.mockRestore();
  });

  it("merges features from every region source configured for a layer", async () => {
    vi.mocked(global.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { region: "a" }, geometry: null },
          ],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [
            { type: "Feature", properties: { region: "b" }, geometry: null },
          ],
        }),
      } as Response);

    const twoSourceDomain: DomainConfig = {
      layers: [
        {
          id: "areas",
          label: "Coverage level",
          dataSource: [
            "/data/example/areas.display.v1.geojson",
            "/data/other/areas.display.v1.geojson",
          ],
          geometryKind: "choropleth",
          defaultVisible: true,
          available: true,
          style: {
            kind: "choropleth",
            propertyKey: "value",
            buckets: [],
            baseOpacity: 0.18,
          },
        },
      ],
      layerGroups: [],
    };

    const { result } = renderHook(() => useLayerData(["areas"]), {
      wrapper: ({ children }) => (
        <DomainProvider domain={twoSourceDomain}>{children}</DomainProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.data.areas?.features).toHaveLength(2);
    });
  });
});
