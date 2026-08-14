import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createNominatimGeocoderProvider,
  fetchLocationSearchResults,
  fetchReverseGeocodeResult,
  nominatimGeocoderProvider,
} from "./locationSearch";

describe("fetchLocationSearchResults", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty array without fetching for a blank query", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const results = await fetchLocationSearchResults("   ");

    expect(results).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps Nominatim results and parses the bounding box", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            place_id: 123,
            display_name: "Soweto, Johannesburg, Gauteng, South Africa",
            lat: "-26.267",
            lon: "27.854",
            boundingbox: ["-26.3", "-26.2", "27.8", "27.9"],
          },
        ],
      }),
    );

    const results = await fetchLocationSearchResults("Soweto");

    expect(results).toEqual([
      {
        id: "123",
        label: "Soweto, Johannesburg, Gauteng, South Africa",
        latitude: -26.267,
        longitude: 27.854,
        bounds: [
          [-26.3, 27.8],
          [-26.2, 27.9],
        ],
      },
    ]);
  });

  it("throws with the HTTP status on a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );

    await expect(fetchLocationSearchResults("Soweto")).rejects.toThrow(/503/);
  });

  it("omits countrycodes from the request when no options are given", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);

    await fetchLocationSearchResults("Soweto");

    const [requestUrl] = fetchMock.mock.calls[0] as [string];
    expect(new URL(requestUrl).searchParams.has("countrycodes")).toBe(false);
  });

  it("applies countryCodes to the request when given", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);

    await fetchLocationSearchResults("Soweto", undefined, {
      countryCodes: "za",
    });

    const [requestUrl] = fetchMock.mock.calls[0] as [string];
    expect(new URL(requestUrl).searchParams.get("countrycodes")).toBe("za");
  });

  it("omits bounds when the bounding box is malformed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            place_id: 123,
            display_name: "Soweto, Johannesburg, Gauteng, South Africa",
            lat: "-26.267",
            lon: "27.854",
            boundingbox: ["-26.3", "not-a-number", "27.8", "27.9"],
          },
        ],
      }),
    );

    const results = await fetchLocationSearchResults("Soweto");

    expect(results[0]?.bounds).toBeUndefined();
  });

  it("skips a result whose latitude/longitude can't be parsed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            place_id: 123,
            display_name: "Somewhere odd",
            lat: "not-a-number",
            lon: "27.854",
          },
        ],
      }),
    );

    const results = await fetchLocationSearchResults("Somewhere");

    expect(results).toEqual([]);
  });
});

describe("fetchReverseGeocodeResult", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves a place from its coordinates", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        place_id: 456,
        display_name: "Braamfontein, Johannesburg, Gauteng, South Africa",
        lat: "-26.19",
        lon: "28.03",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchReverseGeocodeResult(-26.19, 28.03);

    expect(result).toEqual({
      id: "456",
      label: "Braamfontein, Johannesburg, Gauteng, South Africa",
      latitude: -26.19,
      longitude: 28.03,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("nominatim.openstreetmap.org/reverse"),
      expect.objectContaining({ headers: { Accept: "application/json" } }),
    );
    expect(fetchMock.mock.calls[0]?.[0]).toContain("lat=-26.19");
    expect(fetchMock.mock.calls[0]?.[0]).toContain("lon=28.03");
  });

  it("returns null when Nominatim can't geocode the coordinates", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ error: "Unable to geocode" }),
      }),
    );

    const result = await fetchReverseGeocodeResult(0, 0);

    expect(result).toBeNull();
  });

  it("throws with the HTTP status on a non-2xx response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    await expect(fetchReverseGeocodeResult(-26.19, 28.03)).rejects.toThrow(
      /500/,
    );
  });
});

describe("nominatimGeocoderProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delegates reverse to fetchReverseGeocodeResult", () => {
    expect(nominatimGeocoderProvider.reverse).toBe(fetchReverseGeocodeResult);
  });

  it("searches with no country bias by default", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);

    await nominatimGeocoderProvider.search("Soweto");

    const [requestUrl] = fetchMock.mock.calls[0] as [string];
    expect(new URL(requestUrl).searchParams.has("countrycodes")).toBe(false);
  });
});

describe("createNominatimGeocoderProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delegates reverse to fetchReverseGeocodeResult, unaffected by search options", () => {
    const provider = createNominatimGeocoderProvider({ countryCodes: "za" });
    expect(provider.reverse).toBe(fetchReverseGeocodeResult);
  });

  it("applies the configured countryCodes to every search call", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    const provider = createNominatimGeocoderProvider({ countryCodes: "za" });

    await provider.search("Pretoria");

    const [requestUrl] = fetchMock.mock.calls[0] as [string];
    expect(new URL(requestUrl).searchParams.get("countrycodes")).toBe("za");
  });
});
