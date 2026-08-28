import type { TransitLayerFeatureCollection, TransitStop } from "@karta/app";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

function transitLine(network: string): TransitLayerFeatureCollection {
  const stop: TransitStop = { id: "way/1", name: "Test line", network };
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

// Fetch-failure/fallback mechanics (falls back to last published output,
// throws when none exists) are createFetchWithPublishedFallback's own
// behaviour, already covered region-agnostically by
// fetchWithPublishedFallback.test.ts — these only check that each source
// wires up the right fetcher/normalizer.
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
});
