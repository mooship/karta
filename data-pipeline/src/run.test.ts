import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import type { FeatureCollection } from "geojson";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NormalizedTownship } from "./adapters/boundaries";
import type { JobCenter } from "./constants/jobCenters";
import type { NearestJobCenterResult } from "./osrmClient";
import type { PipelineSource, RegionPipelineConfig } from "./pipelineSource";

const mocks = vi.hoisted(() => ({
  fakeArea: {
    id: "fakeville",
    name: "Fakeville",
    metroId: "tshwane",
    selectionBasis: "named-sub-places",
    labelPriority: "primary",
    subPlaceNamePrefixes: ["Fakeville"],
  },
  pruneCache: vi.fn(async () => 0),
  fetchMetroBoundariesForMetros: vi.fn(),
  getNearestJobCenter: vi.fn(),
  getJobCentersForMetro: vi.fn(),
  regionPipelineConfigs: [] as unknown[],
}));

vi.mock("./cache", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./cache")>()),
  pruneCache: mocks.pruneCache,
}));

vi.mock("./adapters/boundaries", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./adapters/boundaries")>()),
  fetchMetroBoundariesForMetros: mocks.fetchMetroBoundariesForMetros,
}));

vi.mock("./osrmClient", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./osrmClient")>()),
  getNearestJobCenter: mocks.getNearestJobCenter,
}));

vi.mock("./constants/jobCenters", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./constants/jobCenters")>()),
  getJobCentersForMetro: mocks.getJobCentersForMetro,
}));

vi.mock("./regionPipelineConfigs", () => ({
  REGION_PIPELINE_CONFIGS: mocks.regionPipelineConfigs,
  getRegionPipelineConfig: vi.fn(),
}));

vi.mock("@karta/app", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@karta/app")>();
  return {
    ...actual,
    REGIONS: [
      { id: "fake-north", label: "Fake North", kind: "province" },
      { id: "fake-south", label: "Fake South", kind: "province" },
      { id: "fake-custom", label: "Fake Custom", kind: "custom" },
    ],
    // `getProvinceRegionIds()` computes internally from `@karta/app`'s own
    // `REGIONS` module binding, not the override above — spreading `actual`
    // alone would leave it resolving against the real gauteng/western-cape
    // regions instead of these fakes, so it needs its own override here too.
    getProvinceRegionIds: () => ["fake-north", "fake-south"],
    TOWNSHIP_AREA_DEFINITIONS: [mocks.fakeArea],
    getTownshipAreaDefinition: (name: string) =>
      name.startsWith("Fakeville") ? mocks.fakeArea : undefined,
  };
});

import { getMetroDefinition, type MetroDefinition } from "@karta/app";
import { runAllProvinceRegions, runRegion } from "./run";

const TSHWANE = getMetroDefinition("tshwane");
const JOHANNESBURG = getMetroDefinition("johannesburg");

const FAKE_JOB_CENTERS: JobCenter[] = Array.from(
  { length: TSHWANE.jobCenterCount },
  (_, index) => ({
    id: `fake-job-center-${index}`,
    name: `Fake Job Centre ${index}`,
    lat: -25.75,
    lon: 28.2,
  }),
);

/**
 * Builds a raw sub-place `FeatureCollection` shaped like the boundary
 * adapter's output, with two square polygons offset far enough apart that
 * the display simplify step keeps every vertex.
 */
function boundaryCollection(
  prefix: string,
  lonOffset: number,
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: [0, 1].map((index) => {
      const lon = 28 + lonOffset + index * 0.2;
      const lat = -25.8;
      return {
        type: "Feature" as const,
        properties: {
          SP_CODE: `${prefix}-${index}`,
          SP_NAME: `Fakeville ${prefix} ${index}`,
          TotalPop: 1000 + index,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: [
            [
              [lon, lat],
              [lon + 0.05, lat],
              [lon + 0.05, lat + 0.05],
              [lon, lat + 0.05],
              [lon, lat],
            ],
          ],
        },
      };
    }),
  };
}

/** Builds a transit `FeatureCollection` with `featureCount` LineStrings on `network`. */
function transitCollection(
  network: string,
  featureCount = 2,
): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: Array.from({ length: featureCount }, (_, index) => ({
      type: "Feature" as const,
      properties: {
        id: `${network}-${index}`,
        name: `${network} route ${index}`,
        network,
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [28.01 + index * 0.01, -25.79],
          [28.06 + index * 0.01, -25.74],
        ],
      },
    })),
  };
}

/** Builds a `PipelineSource` backed by an in-memory collection or a rejection. */
function fakeSource(
  layerId: string,
  outputFileName: string,
  fetchImpl: () => Promise<FeatureCollection>,
): PipelineSource {
  return { layerId, outputFileName, fetch: fetchImpl };
}

/** A minimal, fully in-memory `RegionPipelineConfig` for the `fake-north` region. */
function fakeConfig(
  overrides: Partial<RegionPipelineConfig> = {},
): RegionPipelineConfig {
  return {
    regionId: "fake-north",
    metros: [TSHWANE, JOHANNESBURG],
    sources: [
      fakeSource("fake-transit", "fake-transit.display.v1.geojson", async () =>
        transitCollection("FakeNet"),
      ),
    ],
    requiredNetworks: ["FakeNet"],
    ...overrides,
  };
}

/** Reads a written output file back as a `FeatureCollection`. */
async function readCollection(path: string): Promise<FeatureCollection> {
  return JSON.parse(await readFile(path, "utf8")) as FeatureCollection;
}

let root: string;

beforeEach(async () => {
  root = await mkdtemp(resolve(tmpdir(), "karta-run-"));
  vi.spyOn(console, "log").mockImplementation(() => undefined);
  mocks.pruneCache.mockClear();
  mocks.getJobCentersForMetro.mockReset();
  mocks.getJobCentersForMetro.mockReturnValue(FAKE_JOB_CENTERS);
  mocks.fetchMetroBoundariesForMetros.mockReset();
  mocks.fetchMetroBoundariesForMetros.mockImplementation(
    async (metroIds: string[]) =>
      Object.fromEntries(
        metroIds.map((metroId, index) => [
          metroId,
          boundaryCollection(metroId, index * 0.5),
        ]),
      ),
  );
  mocks.getNearestJobCenter.mockReset();
  mocks.getNearestJobCenter.mockImplementation(
    async (centroids: NormalizedTownship["centroid"][]) =>
      centroids.map(
        (_, index): NearestJobCenterResult => ({
          minutes: 10 + index,
          jobCenterId: "fake-job-center-0",
          jobCenterName: "Fake Job Centre 0",
        }),
      ),
  );
  mocks.regionPipelineConfigs.length = 0;
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

describe("runRegion", () => {
  it("publishes a region's dataset and leaves no staging directory behind", async () => {
    await runRegion(fakeConfig(), root);

    expect(await readdir(root)).toEqual(["fake-north"]);
    const publishDir = resolve(root, "fake-north");
    expect((await readdir(publishDir)).sort()).toEqual(
      [
        "fake-transit.display.v1.geojson",
        "manifest.v1.json",
        "township-areas.display.v1.geojson",
        "townships.display.v1.geojson",
      ].sort(),
    );

    const townships = await readCollection(
      resolve(publishDir, "townships.display.v1.geojson"),
    );
    expect(townships.features).toHaveLength(4);

    const areas = await readCollection(
      resolve(publishDir, "township-areas.display.v1.geojson"),
    );
    expect(areas.features).toHaveLength(1);
    expect(areas.features[0]?.properties).toMatchObject({
      id: "fakeville",
      subPlaceCount: 4,
    });

    const manifest = JSON.parse(
      await readFile(resolve(publishDir, "manifest.v1.json"), "utf8"),
    ) as {
      metroIds: string[];
      networkCoverage: Record<string, number>;
      files: { fileName: string }[];
    };
    expect(manifest.metroIds).toEqual(["tshwane", "johannesburg"]);
    expect(manifest.networkCoverage).toEqual({ FakeNet: 2 });
    expect(manifest.files.map((file) => file.fileName).sort()).toEqual(
      [
        "fake-transit.display.v1.geojson",
        "township-areas.display.v1.geojson",
        "townships.display.v1.geojson",
      ].sort(),
    );

    expect(mocks.pruneCache).toHaveBeenCalledWith(7 * 24 * 60 * 60 * 1000);
  });

  it("fetches boundaries once for every metro and routes each metro's centroids separately", async () => {
    await runRegion(fakeConfig(), root);

    expect(mocks.fetchMetroBoundariesForMetros).toHaveBeenCalledTimes(1);
    expect(mocks.fetchMetroBoundariesForMetros).toHaveBeenCalledWith([
      "tshwane",
      "johannesburg",
    ]);
    expect(mocks.getNearestJobCenter).toHaveBeenCalledTimes(2);
    expect(mocks.getNearestJobCenter.mock.calls[0]?.[0]).toHaveLength(2);
    expect(mocks.getNearestJobCenter.mock.calls[1]?.[0]).toHaveLength(2);
  });

  it("joins each township's drive time and nearest-transit distance into the published output", async () => {
    await runRegion(fakeConfig(), root);

    const townships = await readCollection(
      resolve(root, "fake-north", "townships.display.v1.geojson"),
    );
    const properties = townships.features.map(
      (feature) => feature.properties as Record<string, unknown>,
    );
    expect(properties[0]).toMatchObject({
      commuteMinutes: 10,
      nearestJobCenter: "Fake Job Centre 0",
      population: 1000,
    });
    for (const entry of properties) {
      expect(typeof entry.nearestTransitKm).toBe("number");
    }
  });

  it("replaces a previously published dataset and removes the backup directory", async () => {
    const publishDir = resolve(root, "fake-north");
    await mkdir(publishDir, { recursive: true });
    await writeFile(resolve(publishDir, "stale.geojson"), "{}");

    await runRegion(fakeConfig(), root);

    expect(await readdir(root)).toEqual(["fake-north"]);
    expect(await readdir(publishDir)).not.toContain("stale.geojson");
    expect(await readdir(publishDir)).toContain("manifest.v1.json");
  });

  it("deletes leftover staging directories from an interrupted previous run", async () => {
    const leftover = resolve(root, "fake-north.__staging__1");
    await mkdir(leftover, { recursive: true });
    await writeFile(resolve(leftover, "partial.geojson"), "{}");

    await runRegion(fakeConfig(), root);

    expect(await readdir(root)).toEqual(["fake-north"]);
  });

  it("removes staged output and leaves the previous dataset published when a source fetch fails", async () => {
    const publishDir = resolve(root, "fake-north");
    await mkdir(publishDir, { recursive: true });
    await writeFile(resolve(publishDir, "townships.display.v1.geojson"), "{}");

    const config = fakeConfig({
      sources: [
        fakeSource("fake-transit", "fake-transit.display.v1.geojson", () =>
          Promise.reject(new Error("Overpass exploded")),
        ),
      ],
    });

    await expect(runRegion(config, root)).rejects.toThrow("Overpass exploded");

    expect(await readdir(root)).toEqual(["fake-north"]);
    expect(await readdir(publishDir)).toEqual(["townships.display.v1.geojson"]);
    expect(
      await readFile(
        resolve(publishDir, "townships.display.v1.geojson"),
        "utf8",
      ),
    ).toBe("{}");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("failed after"),
    );
  });

  it("removes staged output written before a missing required network is detected", async () => {
    const publishDir = resolve(root, "fake-north");
    await mkdir(publishDir, { recursive: true });
    await writeFile(resolve(publishDir, "manifest.v1.json"), "{}");

    const config = fakeConfig({ requiredNetworks: ["MissingNet"] });

    await expect(runRegion(config, root)).rejects.toThrow(
      /Missing required transit network coverage: MissingNet/,
    );

    expect(await readdir(root)).toEqual(["fake-north"]);
    expect(await readdir(publishDir)).toEqual(["manifest.v1.json"]);
  });

  it("removes staged output when the built directory fails output validation", async () => {
    const config = fakeConfig({
      sources: [
        fakeSource(
          "fake-transit",
          "fake-transit.display.v1.geojson",
          async () => transitCollection("FakeNet", 0),
        ),
      ],
      requiredNetworks: [],
    });

    await expect(runRegion(config, root)).rejects.toThrow(
      /Output validation failed/,
    );

    expect(await readdir(root)).toEqual([]);
  });

  it("throws before writing anything when the region configures no metros", async () => {
    await expect(runRegion(fakeConfig({ metros: [] }), root)).rejects.toThrow(
      "No metros configured for region: fake-north",
    );

    expect(await readdir(root)).toEqual([]);
  });

  it("throws when a metro's declared job-centre count has drifted from its configured centres", async () => {
    mocks.getJobCentersForMetro.mockReturnValue(FAKE_JOB_CENTERS.slice(0, 1));

    await expect(runRegion(fakeConfig(), root)).rejects.toThrow(
      /Job center count mismatch for tshwane/,
    );

    expect(await readdir(root)).toEqual([]);
  });

  it("throws when a metro has no job centres configured at all", async () => {
    mocks.getJobCentersForMetro.mockReturnValue([]);
    const metroWithoutJobCenters: MetroDefinition = {
      ...TSHWANE,
      jobCenterCount: 0,
    };

    await expect(
      runRegion(fakeConfig({ metros: [metroWithoutJobCenters] }), root),
    ).rejects.toThrow("No job centers configured for tshwane");

    expect(await readdir(root)).toEqual([]);
    expect(mocks.getNearestJobCenter).not.toHaveBeenCalled();
  });

  describe("metro concurrency", () => {
    /**
     * Wires `getNearestJobCenter` to record how many calls are in flight at
     * once, so a test can assert whether metros overlapped without relying
     * on timing thresholds.
     */
    function trackConcurrency() {
      let inFlight = 0;
      let maxInFlight = 0;
      mocks.getNearestJobCenter.mockImplementation(
        async (centroids: NormalizedTownship["centroid"][]) => {
          inFlight += 1;
          maxInFlight = Math.max(maxInFlight, inFlight);
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 10));
          inFlight -= 1;
          return centroids.map(
            (_, index): NearestJobCenterResult => ({
              minutes: 10 + index,
              jobCenterId: "fake-job-center-0",
              jobCenterName: "Fake Job Centre 0",
            }),
          );
        },
      );
      return () => maxInFlight;
    }

    afterEach(() => {
      Reflect.deleteProperty(process.env, "OSRM_BASE_URL");
    });

    it("processes metros sequentially against the default public OSRM endpoint", async () => {
      const getMaxInFlight = trackConcurrency();

      await runRegion(fakeConfig(), root);

      expect(getMaxInFlight()).toBe(1);
      expect(mocks.getNearestJobCenter).toHaveBeenCalledTimes(2);
    });

    it("processes metros concurrently once a custom OSRM_BASE_URL is configured", async () => {
      process.env.OSRM_BASE_URL = "http://localhost:5000";
      const getMaxInFlight = trackConcurrency();

      await runRegion(fakeConfig(), root);

      expect(getMaxInFlight()).toBe(2);
      expect(mocks.getNearestJobCenter).toHaveBeenCalledTimes(2);
    });

    it("publishes output in configured metro order regardless of which mode processed it", async () => {
      process.env.OSRM_BASE_URL = "http://localhost:5000";
      trackConcurrency();

      await runRegion(fakeConfig(), root);

      const manifest = JSON.parse(
        await readFile(resolve(root, "fake-north", "manifest.v1.json"), "utf8"),
      ) as { metroIds: string[] };
      expect(manifest.metroIds).toEqual(["tshwane", "johannesburg"]);
    });
  });
});

describe("runAllProvinceRegions", () => {
  it("publishes every province region and skips regions of another kind", async () => {
    mocks.regionPipelineConfigs.push(
      fakeConfig(),
      fakeConfig({
        regionId: "fake-custom",
        metros: [TSHWANE],
      }),
    );

    await runAllProvinceRegions(root);

    expect(await readdir(root)).toEqual(["fake-north"]);
  });

  it("publishes each configured province region into its own directory", async () => {
    mocks.regionPipelineConfigs.push(
      fakeConfig({ metros: [TSHWANE] }),
      fakeConfig({ regionId: "fake-south", metros: [JOHANNESBURG] }),
    );

    await runAllProvinceRegions(root);

    expect((await readdir(root)).sort()).toEqual(["fake-north", "fake-south"]);
  });

  it("stops at the first failing region, leaving later regions unpublished and no staging behind", async () => {
    mocks.regionPipelineConfigs.push(
      fakeConfig({
        metros: [TSHWANE],
        sources: [
          fakeSource("fake-transit", "fake-transit.display.v1.geojson", () =>
            Promise.reject(new Error("Overpass exploded")),
          ),
        ],
      }),
      fakeConfig({ regionId: "fake-south", metros: [JOHANNESBURG] }),
    );

    await expect(runAllProvinceRegions(root)).rejects.toThrow(
      "Overpass exploded",
    );

    expect(await readdir(root)).toEqual([]);
  });
});
