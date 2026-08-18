import type { LayerBrowseConfig } from "@karta/core";
import type { FeatureCollection } from "geojson";
import { describe, expect, it } from "vitest";
import { buildFeatureBrowserEntries } from "./buildFeatureBrowserEntries";

const collection: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: null,
      properties: { id: "a", name: "Alexandra", metroId: "johannesburg" },
    },
    {
      type: "Feature",
      geometry: null,
      properties: { id: "b", name: "Mamelodi", metroId: "tshwane" },
    },
  ],
};

describe("buildFeatureBrowserEntries", () => {
  it("returns no entries when the collection is undefined", () => {
    const browsable: LayerBrowseConfig = { searchable: false };

    expect(buildFeatureBrowserEntries(browsable, undefined)).toEqual([]);
  });

  it("builds one entry per feature, reading id and the configured labelField", () => {
    const browsable: LayerBrowseConfig = {
      groupField: "metroId",
      labelField: "name",
      searchable: false,
    };

    const entries = buildFeatureBrowserEntries(browsable, collection);

    expect(entries).toEqual([
      {
        id: "a",
        label: "Alexandra",
        groupId: "johannesburg",
        groupLabel: "johannesburg",
      },
      { id: "b", label: "Mamelodi", groupId: "tshwane", groupLabel: "tshwane" },
    ]);
  });

  it("resolves each entry's groupLabel via the given callback", () => {
    const browsable: LayerBrowseConfig = {
      groupField: "metroId",
      labelField: "name",
      searchable: false,
    };

    const entries = buildFeatureBrowserEntries(
      browsable,
      collection,
      (groupId) => (groupId === "tshwane" ? "Tshwane" : undefined),
    );

    expect(entries[0]).toMatchObject({
      groupId: "johannesburg",
      groupLabel: "johannesburg",
    });
    expect(entries[1]).toMatchObject({
      groupId: "tshwane",
      groupLabel: "Tshwane",
    });
  });

  it("leaves groupId/groupLabel undefined when browsable declares no groupField", () => {
    const browsable: LayerBrowseConfig = {
      labelField: "name",
      searchable: false,
    };

    const entries = buildFeatureBrowserEntries(browsable, collection);

    expect(entries[0]?.groupId).toBeUndefined();
    expect(entries[0]?.groupLabel).toBeUndefined();
  });

  it("falls back to the feature's id as the label when labelField is missing or non-string", () => {
    const browsable: LayerBrowseConfig = {
      labelField: "missing",
      searchable: false,
    };

    const entries = buildFeatureBrowserEntries(browsable, collection);

    expect(entries[0]?.label).toBe("a");
  });

  it("defaults labelField to 'name' when browsable omits it", () => {
    const browsable: LayerBrowseConfig = { searchable: false };

    const entries = buildFeatureBrowserEntries(browsable, collection);

    expect(entries[0]?.label).toBe("Alexandra");
  });

  it("skips features with no string id", () => {
    const withMissingId: FeatureCollection = {
      type: "FeatureCollection",
      features: [
        { type: "Feature", geometry: null, properties: { name: "No id" } },
      ],
    };
    const browsable: LayerBrowseConfig = { searchable: false };

    expect(buildFeatureBrowserEntries(browsable, withMissingId)).toEqual([]);
  });
});
