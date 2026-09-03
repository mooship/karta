import { clearFeatureCollectionCache } from "@karta/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchTownships } from "./fetchTownships";

describe("fetchTownships", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearFeatureCollectionCache();
  });

  it("fetches the given URL and returns the parsed features array", async () => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            id: "A",
            name: "Mamelodi",
            commuteMinutes: 20,
            nearestJobCenter: "Pretoria CBD",
            distanceKm: null,
            nearestTransitKm: null,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [28, -25],
                [28.1, -25],
                [28.1, -25.1],
                [28, -25],
              ],
            ],
          },
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => geojson }),
    );

    const result = await fetchTownships("/data/townships.v1.geojson");

    expect(fetch).toHaveBeenCalledWith(
      "/data/townships.v1.geojson",
      expect.objectContaining({ signal: undefined }),
    );
    expect(result).toEqual(geojson.features);
  });

  it("forwards a given AbortSignal through to the underlying fetch call", async () => {
    const geojson = { type: "FeatureCollection", features: [] };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => geojson }),
    );
    const controller = new AbortController();

    await fetchTownships("/data/townships.v1.geojson", controller.signal);

    expect(fetch).toHaveBeenCalledWith(
      "/data/townships.v1.geojson",
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it("keeps an existing numeric nearestTransitKm value instead of the null fallback", async () => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            id: "A",
            name: "Mamelodi",
            commuteMinutes: 20,
            nearestJobCenter: "Pretoria CBD",
            distanceKm: null,
            nearestTransitKm: 1.5,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [28, -25],
                [28.1, -25],
                [28.1, -25.1],
                [28, -25],
              ],
            ],
          },
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => geojson }),
    );

    const result = await fetchTownships("/data/townships.v1.geojson");

    expect(result[0]?.properties.nearestTransitKm).toBe(1.5);
  });

  it("fills in a null nearestTransitKm when the source omits the field", async () => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            id: "A",
            name: "Mamelodi",
            commuteMinutes: 20,
            nearestJobCenter: "Pretoria CBD",
            distanceKm: null,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [28, -25],
                [28.1, -25],
                [28.1, -25.1],
                [28, -25],
              ],
            ],
          },
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => geojson }),
    );

    const result = await fetchTownships("/data/townships.v1.geojson");

    expect(result[0]?.properties.nearestTransitKm).toBeNull();
  });

  it("throws a descriptive error when the fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );

    await expect(fetchTownships("/data/missing.geojson")).rejects.toThrow(
      "Failed to load /data/missing.geojson: 404",
    );
  });

  it("rejects township features with invalid evidence properties", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                id: "A",
                name: "Mamelodi",
                commuteMinutes: "twenty",
              },
              geometry: null,
            },
          ],
        }),
      }),
    );

    await expect(fetchTownships("/data/townships.geojson")).rejects.toThrow(
      /invalid geojson.*commuteMinutes/i,
    );
  });

  it("rejects township features with non-polygon geometry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                id: "A",
                name: "Mamelodi",
                commuteMinutes: 20,
                nearestJobCenter: "Pretoria CBD",
                distanceKm: null,
                nearestTransitKm: null,
              },
              geometry: { type: "Point", coordinates: [28, -25] },
            },
          ],
        }),
      }),
    );

    await expect(fetchTownships("/data/townships.geojson")).rejects.toThrow(
      /geometry/i,
    );
  });

  it("rejects a payload with no features array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ type: "FeatureCollection" }),
      }),
    );

    await expect(fetchTownships("/data/townships.v1.geojson")).rejects.toThrow(
      /invalid geojson.*features/i,
    );
  });
});
