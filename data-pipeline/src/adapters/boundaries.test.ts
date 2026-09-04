import { mkdtemp, utimes } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import AdmZip from "adm-zip";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hashKey, readJsonCache, writeJsonCache } from "../cache";

const shapefileReadMock = vi.hoisted(() => vi.fn());
vi.mock("shapefile", () => ({ read: shapefileReadMock }));

import {
  BOUNDARY_SOURCE_URL,
  fetchMetroBoundariesForMetros,
  fetchNationalBoundaries,
  filterFeaturesByMunicipality,
  normalizeBoundaries,
} from "./boundaries";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  shapefileReadMock.mockReset();
});

/** Enables real disk caching for a test, mirroring `cache.test.ts`'s setup. */
async function useRealCacheDir(): Promise<string> {
  const dir = await mkdtemp(resolve(tmpdir(), "karta-boundaries-cache-"));
  vi.stubEnv("VITEST", "false");
  vi.stubEnv("PIPELINE_CACHE_DIR", dir);
  vi.stubEnv("PIPELINE_CACHE", "");
  return dir;
}

function fakeZipBuffer(): ArrayBufferLike {
  const zip = new AdmZip();
  zip.addFile("Subplace/SP_SA_2011.shp", Buffer.from("shp bytes"));
  zip.addFile("Subplace/SP_SA_2011.dbf", Buffer.from("dbf bytes"));
  const zipBuffer = zip.toBuffer();
  return zipBuffer.buffer.slice(
    zipBuffer.byteOffset,
    zipBuffer.byteOffset + zipBuffer.byteLength,
  );
}

describe("normalizeBoundaries", () => {
  it("maps raw sub-place properties to NormalizedTownship and computes a centroid", () => {
    const raw = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {
            SP_CODE: "799013001",
            SP_NAME: "Mamelodi SP",
            TotalPop: 334577,
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [28.4, -25.68],
                [28.42, -25.68],
                [28.42, -25.66],
                [28.4, -25.66],
                [28.4, -25.68],
              ],
            ],
          },
        },
      ],
    };

    const result = normalizeBoundaries(raw);

    expect(result).toHaveLength(1);
    const [township] = result;
    expect(township).toMatchObject({
      id: "799013001",
      name: "Mamelodi SP",
      population: 334577,
    });
    expect(township?.centroid.lat).toBeCloseTo(-25.67, 1);
    expect(township?.centroid.lon).toBeCloseTo(28.41, 1);
  });

  it("omits population when the source field is missing", () => {
    const raw = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { SP_CODE: "1", SP_NAME: "Unnamed" },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [28, -25.8],
                [28.1, -25.8],
                [28.1, -25.7],
                [28, -25.7],
                [28, -25.8],
              ],
            ],
          },
        },
      ],
    };

    const result = normalizeBoundaries(raw);

    const [township] = result;
    expect(township?.population).toBeUndefined();
  });
});

describe("filterFeaturesByMunicipality", () => {
  it("keeps only City of Tshwane (MN_CODE 799) records and remaps their properties", () => {
    const nationalCollection = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {
            SP_CODE: 799016009,
            SP_NAME: "Odinburg Gardens",
            MN_CODE: 799,
            MN_NAME: "City of Tshwane",
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [28.4, -25.68],
                [28.42, -25.68],
                [28.42, -25.66],
                [28.4, -25.66],
                [28.4, -25.68],
              ],
            ],
          },
        },
        {
          type: "Feature" as const,
          properties: {
            SP_CODE: 199041044,
            SP_NAME: "Oranjezicht",
            MN_CODE: 199,
            MN_NAME: "City of Cape Town",
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [18.4, -33.94],
                [18.42, -33.94],
                [18.42, -33.92],
                [18.4, -33.92],
                [18.4, -33.94],
              ],
            ],
          },
        },
      ],
    };

    const result = filterFeaturesByMunicipality(nationalCollection, [799]);

    expect(result.features).toHaveLength(1);
    const [feature] = result.features;
    expect(feature?.properties).toEqual({
      SP_CODE: "799016009",
      SP_NAME: "Odinburg Gardens",
    });
  });

  it("returns an empty feature list when no record matches the Tshwane municipality code", () => {
    const nationalCollection = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {
            SP_CODE: 199041044,
            SP_NAME: "Oranjezicht",
            MN_CODE: 199,
            MN_NAME: "City of Cape Town",
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [18.4, -33.94],
                [18.42, -33.94],
                [18.42, -33.92],
                [18.4, -33.92],
                [18.4, -33.94],
              ],
            ],
          },
        },
      ],
    };

    const result = filterFeaturesByMunicipality(nationalCollection, [799]);

    expect(result.features).toHaveLength(0);
  });

  it("supports merged municipalities by accepting multiple municipality codes", () => {
    const nationalCollection = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: {
            SP_CODE: 764004001,
            SP_NAME: "Mohlakeng",
            MN_CODE: 764,
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [27.66, -26.18],
                [27.67, -26.18],
                [27.67, -26.17],
                [27.66, -26.17],
                [27.66, -26.18],
              ],
            ],
          },
        },
        {
          type: "Feature" as const,
          properties: {
            SP_CODE: 765002001,
            SP_NAME: "Bekkersdal",
            MN_CODE: 765,
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [27.62, -26.35],
                [27.63, -26.35],
                [27.63, -26.34],
                [27.62, -26.34],
                [27.62, -26.35],
              ],
            ],
          },
        },
      ],
    };

    const result = filterFeaturesByMunicipality(nationalCollection, [764, 765]);

    expect(result.features).toHaveLength(2);
    expect(result.features.map((feature) => feature.properties)).toEqual([
      {
        SP_CODE: "764004001",
        SP_NAME: "Mohlakeng",
      },
      {
        SP_CODE: "765002001",
        SP_NAME: "Bekkersdal",
      },
    ]);
  });
});

describe("fetchNationalBoundaries", () => {
  it("throws when the boundary source download fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 404 });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchNationalBoundaries()).rejects.toThrow(
      "Failed to fetch metro boundaries: 404",
    );
  });

  it("throws when the downloaded zip archive is missing the expected shapefile entries", async () => {
    const zip = new AdmZip();
    zip.addFile("Subplace/README.txt", Buffer.from("not a shapefile"));
    const zipBuffer = zip.toBuffer();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () =>
        zipBuffer.buffer.slice(
          zipBuffer.byteOffset,
          zipBuffer.byteOffset + zipBuffer.byteLength,
        ),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchNationalBoundaries()).rejects.toThrow(
      "Expected Subplace/SP_SA_2011.shp and Subplace/SP_SA_2011.dbf entries in the boundary zip archive",
    );
  });
});

describe("fetchNationalBoundaries caching", () => {
  it("returns a cached result without fetching when a fresh cache entry exists", async () => {
    await useRealCacheDir();
    const cached = { type: "FeatureCollection" as const, features: [] };
    await writeJsonCache(
      "boundaries",
      hashKey(["boundaries", BOUNDARY_SOURCE_URL]),
      cached,
    );
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchNationalBoundaries();

    expect(result).toEqual(cached);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches, parses, and caches the result on a cache miss", async () => {
    await useRealCacheDir();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => fakeZipBuffer(),
    });
    vi.stubGlobal("fetch", fetchMock);
    const parsed = {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { SP_CODE: 1, SP_NAME: "Fixture" },
          geometry: { type: "Polygon" as const, coordinates: [] },
        },
      ],
    };
    shapefileReadMock.mockResolvedValue(parsed);

    const result = await fetchNationalBoundaries();

    expect(result).toEqual(parsed);
    const cachedNow = await readJsonCache(
      "boundaries",
      hashKey(["boundaries", BOUNDARY_SOURCE_URL]),
      { allowStale: true },
    );
    expect(cachedNow).toEqual(parsed);
  });

  it("falls back to a stale cached result when the live fetch fails", async () => {
    const dir = await useRealCacheDir();
    const stale = { type: "FeatureCollection" as const, features: [] };
    const cacheKey = hashKey(["boundaries", BOUNDARY_SOURCE_URL]);
    await writeJsonCache("boundaries", cacheKey, stale);
    const cachedPath = resolve(dir, "boundaries", `${cacheKey}.json`);
    const old = new Date(Date.now() - 1000 * 60 * 60 * 24 * 60);
    await utimes(cachedPath, old, old);
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchNationalBoundaries();

    expect(result).toEqual(stale);
  });

  it("rethrows the original error when the fetch fails and no cached fallback exists", async () => {
    await useRealCacheDir();
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchNationalBoundaries()).rejects.toThrow(
      "Failed to fetch metro boundaries: 500",
    );
  });
});

describe("fetchMetroBoundariesForMetros", () => {
  it("fetches and parses the national boundary zip exactly once for multiple metros", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => fakeZipBuffer(),
    });
    vi.stubGlobal("fetch", fetchMock);
    shapefileReadMock.mockResolvedValue({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            SP_CODE: 799016009,
            SP_NAME: "Odinburg Gardens",
            MN_CODE: 799,
          },
          geometry: { type: "Polygon", coordinates: [] },
        },
        {
          type: "Feature",
          properties: {
            SP_CODE: 798001001,
            SP_NAME: "Randburg",
            MN_CODE: 798,
          },
          geometry: { type: "Polygon", coordinates: [] },
        },
      ],
    });

    const result = await fetchMetroBoundariesForMetros([
      "tshwane",
      "johannesburg",
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(shapefileReadMock).toHaveBeenCalledTimes(1);
    expect(result.tshwane.features).toHaveLength(1);
    expect(result.tshwane.features[0]?.properties).toEqual({
      SP_CODE: "799016009",
      SP_NAME: "Odinburg Gardens",
    });
    expect(result.johannesburg.features).toHaveLength(1);
    expect(result.johannesburg.features[0]?.properties).toEqual({
      SP_CODE: "798001001",
      SP_NAME: "Randburg",
    });
  });
});
