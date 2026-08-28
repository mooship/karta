import { afterEach, describe, expect, it, vi } from "vitest";
import type { OverpassResponse } from "./gautrain";
import { normalizeMyCitiOverpass } from "./myciti";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizeMyCitiOverpass", () => {
  it("normalizes way members of a MyCiTi route relation into LineString features, deduplicating shared members", () => {
    const raw: OverpassResponse = {
      elements: [
        {
          type: "relation" as const,
          id: 7654321,
          tags: {
            name: "MyCiTi T01: Table View => Civic Centre",
            network: "MyCiTi",
            route: "bus",
            ref: "T01",
          },
          members: [
            {
              type: "way",
              ref: 200,
              geometry: [
                { lat: -33.813, lon: 18.487 },
                { lat: -33.925, lon: 18.424 },
              ],
            },
            {
              type: "way",
              ref: 200,
              geometry: [
                { lat: -33.813, lon: 18.487 },
                { lat: -33.925, lon: 18.424 },
              ],
            },
          ],
        },
      ],
    };

    const result = normalizeMyCitiOverpass(raw);

    expect(result.features).toHaveLength(1);
    expect(result.features[0]?.properties).toEqual({
      id: "relation/7654321",
      name: "MyCiTi T01: Table View => Civic Centre",
      network: "MyCiTi",
    });
    expect(result.features[0]?.geometry).toEqual({
      type: "LineString",
      coordinates: [
        [18.487, -33.813],
        [18.424, -33.925],
      ],
    });
  });

  it("ignores relation members without geometry or of a non-way type", () => {
    const raw: OverpassResponse = {
      elements: [
        {
          type: "relation" as const,
          id: 1,
          tags: { network: "MyCiTi", route: "bus" },
          members: [
            { type: "node", ref: 5 },
            { type: "way", ref: 6, geometry: undefined },
          ],
        },
      ],
    };

    const result = normalizeMyCitiOverpass(raw);

    expect(result.features).toHaveLength(0);
  });
});

describe("fetchMyCitiRoutes", () => {
  it("queries Overpass for MyCiTi bus routes within the given bbox", async () => {
    const raw: OverpassResponse = { elements: [] };
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => raw });
    vi.stubGlobal("fetch", fetchMock);

    const { fetchMyCitiRoutes } = await import("./myciti");
    const result = await fetchMyCitiRoutes("-34.35,18.30,-33.45,18.85");

    expect(result).toEqual(raw);
    const body = fetchMock.mock.calls[0]?.[1]?.body as string;
    expect(decodeURIComponent(body)).toMatch(/network"~"MyCiTi"/);
  });
});
