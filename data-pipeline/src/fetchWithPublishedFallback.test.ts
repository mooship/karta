import type { TransitLayerFeatureCollection } from "@karta/app";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { statMock, readFileMock } = vi.hoisted(() => ({
  statMock: vi.fn(),
  readFileMock: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  stat: statMock,
  readFile: readFileMock,
}));

const { createFetchWithPublishedFallback } = await import(
  "./fetchWithPublishedFallback"
);

function transitLine(network: string): TransitLayerFeatureCollection {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: "way/1", name: "Test line", network },
        geometry: {
          type: "LineString",
          coordinates: [
            [18, -33],
            [18.1, -33.1],
          ],
        },
      },
    ],
  };
}

describe("createFetchWithPublishedFallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the fetch result directly when it succeeds", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    const normalized = transitLine("MyCiTi");

    const result = await fetchWithPublishedFallback({
      sourceName: "MyCiTi",
      fallbackLayerName: "bus-rapid-transit",
      fetch: async () => normalized,
    });

    expect(result).toBe(normalized);
    expect(statMock).not.toHaveBeenCalled();
  });

  it("falls back to the last published output for the given region when the fetch fails", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock.mockResolvedValueOnce(undefined);
    const fallback = transitLine("MyCiTi");
    readFileMock.mockResolvedValueOnce(JSON.stringify(fallback));

    const result = await fetchWithPublishedFallback({
      sourceName: "MyCiTi",
      fallbackLayerName: "bus-rapid-transit",
      fetch: async () => {
        throw new Error("network down");
      },
    });

    expect(result).toEqual(fallback);
    expect(statMock.mock.calls[0]?.[0]).toContain("western-cape");
  });

  it("applies recoverFromFallback to the fallback collection", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("gauteng");
    statMock.mockResolvedValueOnce(undefined);
    const fallback: TransitLayerFeatureCollection = {
      type: "FeatureCollection",
      features: [...transitLine("A").features, ...transitLine("B").features],
    };
    readFileMock.mockResolvedValueOnce(JSON.stringify(fallback));

    const result = await fetchWithPublishedFallback({
      sourceName: "A",
      fallbackLayerName: "bus-rapid-transit",
      fetch: async () => {
        throw new Error("network down");
      },
      recoverFromFallback: (collection) => ({
        type: "FeatureCollection",
        features: collection.features.filter(
          (f) => (f.properties as { network: string }).network === "A",
        ),
      }),
    });

    expect(result.features).toHaveLength(1);
    expect(
      (result.features[0]?.properties as { network: string } | undefined)
        ?.network,
    ).toBe("A");
  });

  it("falls back to the last published output when the fetch resolves with zero features", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock.mockResolvedValueOnce(undefined);
    const fallback = transitLine("MyCiTi");
    readFileMock.mockResolvedValueOnce(JSON.stringify(fallback));

    const result = await fetchWithPublishedFallback({
      sourceName: "MyCiTi",
      fallbackLayerName: "bus-rapid-transit",
      fetch: async () => ({ type: "FeatureCollection", features: [] }),
    });

    expect(result).toEqual(fallback);
  });

  it("throws when the fetch resolves with zero features and no fallback output exists", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock.mockRejectedValue(new Error("ENOENT"));

    await expect(
      fetchWithPublishedFallback({
        sourceName: "MyCiTi",
        fallbackLayerName: "bus-rapid-transit",
        fetch: async () => ({ type: "FeatureCollection", features: [] }),
      }),
    ).rejects.toThrow("Failed to fetch MyCiTi and no fallback output exists");
  });

  it("throws when the fetch fails and no fallback output exists", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock.mockRejectedValue(new Error("ENOENT"));

    await expect(
      fetchWithPublishedFallback({
        sourceName: "MyCiTi",
        fallbackLayerName: "bus-rapid-transit",
        fetch: async () => {
          throw new Error("network down");
        },
      }),
    ).rejects.toThrow("Failed to fetch MyCiTi and no fallback output exists");
  });

  it("throws when the recovered fallback has no features", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("gauteng");
    statMock.mockResolvedValueOnce(undefined);
    readFileMock.mockResolvedValueOnce(JSON.stringify(transitLine("B")));

    await expect(
      fetchWithPublishedFallback({
        sourceName: "A",
        fallbackLayerName: "bus-rapid-transit",
        fetch: async () => {
          throw new Error("network down");
        },
        recoverFromFallback: (collection) => ({
          type: "FeatureCollection",
          features: collection.features.filter(
            (f) => (f.properties as { network: string }).network === "A",
          ),
        }),
      }),
    ).rejects.toThrow("Failed to recover A from fallback output");
  });

  it("falls back to the plain .v1.geojson file when the .display.v1 file is missing", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock
      .mockRejectedValueOnce(new Error("ENOENT"))
      .mockResolvedValueOnce(undefined);
    const fallback = transitLine("MyCiTi");
    readFileMock.mockResolvedValueOnce(JSON.stringify(fallback));

    const result = await fetchWithPublishedFallback({
      sourceName: "MyCiTi",
      fallbackLayerName: "bus-rapid-transit",
      fetch: async () => {
        throw new Error("network down");
      },
    });

    expect(result).toEqual(fallback);
  });

  it("skips a candidate with corrupt JSON and falls through to no-fallback", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock.mockResolvedValue(undefined);
    readFileMock.mockResolvedValue("{not json");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      fetchWithPublishedFallback({
        sourceName: "MyCiTi",
        fallbackLayerName: "bus-rapid-transit",
        fetch: async () => {
          throw new Error("network down");
        },
      }),
    ).rejects.toThrow("Failed to fetch MyCiTi and no fallback output exists");

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to read fallback candidate"),
      expect.any(String),
      expect.any(Error),
    );
    warnSpy.mockRestore();
  });

  it("skips a candidate whose parsed content has no features and falls through", async () => {
    const fetchWithPublishedFallback =
      createFetchWithPublishedFallback("western-cape");
    statMock.mockResolvedValue(undefined);
    readFileMock.mockResolvedValue(
      JSON.stringify({ type: "FeatureCollection", features: [] }),
    );

    await expect(
      fetchWithPublishedFallback({
        sourceName: "MyCiTi",
        fallbackLayerName: "bus-rapid-transit",
        fetch: async () => {
          throw new Error("network down");
        },
      }),
    ).rejects.toThrow("Failed to fetch MyCiTi and no fallback output exists");
  });
});
