import type { TransitLayerFeatureCollection, TransitStop } from "@karta/app";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { statMock, readFileMock } = vi.hoisted(() => ({
  statMock: vi.fn(),
  readFileMock: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  stat: statMock,
  readFile: readFileMock,
}));

const { fetchMyCitiRoutesMock, normalizeMyCitiOverpassMock } = vi.hoisted(
  () => ({
    fetchMyCitiRoutesMock: vi.fn(),
    normalizeMyCitiOverpassMock: vi.fn(),
  }),
);
vi.mock("../adapters/myciti", () => ({
  fetchMyCitiRoutes: fetchMyCitiRoutesMock,
  normalizeMyCitiOverpass: normalizeMyCitiOverpassMock,
}));

const { fetchPrasaRailMock, normalizePrasaOverpassMock } = vi.hoisted(() => ({
  fetchPrasaRailMock: vi.fn(),
  normalizePrasaOverpassMock: vi.fn(),
}));
vi.mock("../adapters/prasa", () => ({
  fetchPrasaRail: fetchPrasaRailMock,
  normalizePrasaOverpass: normalizePrasaOverpassMock,
}));

const { WESTERN_CAPE_PIPELINE_CONFIG } = await import(
  "./westernCapePipelineConfig"
);

function findSource(layerId: string) {
  const source = WESTERN_CAPE_PIPELINE_CONFIG.sources.find(
    (s) => s.layerId === layerId,
  );
  if (!source) {
    throw new Error(`No source registered for layerId ${layerId}`);
  }
  return source;
}

function transitLine(
  network: string,
  id = "way/1",
): TransitLayerFeatureCollection {
  const stop: TransitStop = { id, name: "Test line", network };
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: stop,
        geometry: {
          type: "LineString",
          coordinates: [
            [18.4, -33.9],
            [18.5, -34.0],
          ],
        },
      },
    ],
  };
}

describe("WESTERN_CAPE_PIPELINE_CONFIG", () => {
  it("has one source per current output transit layer", () => {
    expect(WESTERN_CAPE_PIPELINE_CONFIG.regionId).toBe("western-cape");
    expect(
      WESTERN_CAPE_PIPELINE_CONFIG.sources.map((s) => s.layerId).sort(),
    ).toEqual(["bus-rapid-transit", "commuter-rail"]);
  });

  it("maps each source to the same output filename run.ts writes today", () => {
    const byLayerId = Object.fromEntries(
      WESTERN_CAPE_PIPELINE_CONFIG.sources.map((s) => [
        s.layerId,
        s.outputFileName,
      ]),
    );
    expect(byLayerId["bus-rapid-transit"]).toBe(
      "bus-rapid-transit.display.v1.geojson",
    );
    expect(byLayerId["commuter-rail"]).toBe("commuter-rail.display.v1.geojson");
  });

  it("includes only the City of Cape Town metro", () => {
    expect(WESTERN_CAPE_PIPELINE_CONFIG.metros).toHaveLength(1);
    expect(WESTERN_CAPE_PIPELINE_CONFIG.metros[0]?.id).toBe("cape-town");
  });

  it("requires the MyCiTi and PRASA networks", () => {
    expect(WESTERN_CAPE_PIPELINE_CONFIG.requiredNetworks).toEqual([
      "MyCiTi",
      "PRASA",
    ]);
  });
});

describe("fetchBusRapidTransit (bus-rapid-transit source)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes a successful MyCiTi fetch", async () => {
    fetchMyCitiRoutesMock.mockResolvedValue({ elements: [] });
    const normalized = transitLine("MyCiTi");
    normalizeMyCitiOverpassMock.mockReturnValue(normalized);

    const result = await findSource("bus-rapid-transit").fetch();

    expect(result).toBe(normalized);
  });

  it("falls back to the last published output when the fetch fails", async () => {
    fetchMyCitiRoutesMock.mockRejectedValue(new Error("network down"));
    statMock.mockResolvedValueOnce(undefined);
    const fallback = transitLine("MyCiTi");
    readFileMock.mockResolvedValueOnce(JSON.stringify(fallback));

    const result = await findSource("bus-rapid-transit").fetch();

    expect(result).toEqual(fallback);
    expect(statMock.mock.calls[0]?.[0]).toContain("western-cape");
  });

  it("throws when the fetch fails and no fallback output exists", async () => {
    fetchMyCitiRoutesMock.mockRejectedValue(new Error("network down"));
    statMock.mockRejectedValue(new Error("ENOENT"));

    await expect(findSource("bus-rapid-transit").fetch()).rejects.toThrow(
      "Failed to fetch MyCiTi and no fallback output exists",
    );
  });
});

describe("fetchCommuterRail (commuter-rail source)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes a successful PRASA/Metrorail fetch, scoped to the Cape Town bbox", async () => {
    fetchPrasaRailMock.mockResolvedValue({ elements: [] });
    const normalized = transitLine("PRASA");
    normalizePrasaOverpassMock.mockReturnValue(normalized);

    const result = await findSource("commuter-rail").fetch();

    expect(result).toBe(normalized);
    expect(fetchPrasaRailMock).toHaveBeenCalledWith(
      expect.stringContaining("18.3"),
    );
  });

  it("falls back to the last published output when the fetch fails", async () => {
    fetchPrasaRailMock.mockRejectedValue(new Error("network down"));
    statMock.mockResolvedValueOnce(undefined);
    const fallback = transitLine("PRASA");
    readFileMock.mockResolvedValueOnce(JSON.stringify(fallback));

    const result = await findSource("commuter-rail").fetch();

    expect(result).toEqual(fallback);
  });

  it("throws when the fetch fails and no fallback output exists", async () => {
    fetchPrasaRailMock.mockRejectedValue(new Error("network down"));
    statMock.mockRejectedValue(new Error("ENOENT"));

    await expect(findSource("commuter-rail").fetch()).rejects.toThrow(
      "Failed to fetch PRASA rail and no fallback output exists",
    );
  });
});
