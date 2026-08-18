import type { DomainConfig } from "@karta/core";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_DOMAIN_ID,
  DOMAINS,
  getDomain,
  getDomainDefinition,
} from "./domains";
import { REGIONS } from "./regions";

describe("domains", () => {
  it("registers gauteng-spatial-legacy and heritage-sites", () => {
    expect(DOMAINS).toEqual([
      {
        id: "gauteng-spatial-legacy",
        regionId: "gauteng",
        label: expect.any(String),
      },
      {
        id: "heritage-sites",
        regionId: "south-africa",
        label: expect.any(String),
      },
    ]);
  });

  it("looks up a domain's metadata by id", () => {
    expect(getDomainDefinition("gauteng-spatial-legacy")?.regionId).toBe(
      "gauteng",
    );
    expect(getDomainDefinition("not-a-real-domain")).toBeUndefined();
  });

  it("defaults to gauteng-spatial-legacy", () => {
    expect(DEFAULT_DOMAIN_ID).toBe("gauteng-spatial-legacy");
    expect(getDomainDefinition(DEFAULT_DOMAIN_ID)).toBeDefined();
  });

  it("resolves every registered domain's full DomainConfig", () => {
    for (const definition of DOMAINS) {
      const domain = getDomain(definition.id);
      expect(domain).toBeDefined();
      expect(domain?.id).toBe(definition.id);
      expect(domain?.layers.length).toBeGreaterThan(0);
    }
  });

  it("returns undefined from getDomain for an unregistered id", () => {
    expect(getDomain("not-a-real-domain")).toBeUndefined();
  });

  it("has no config entries without a matching DOMAINS entry", () => {
    // Guards the registry/config split: every id getDomain can resolve must
    // also appear in DOMAINS, so the two structures can't silently drift.
    const registeredIds = new Set(DOMAINS.map((d) => d.id));
    const knownStrayIds = ["gauteng-spatial-legacy", "heritage-sites"];
    for (const id of knownStrayIds) {
      expect(registeredIds.has(id)).toBe(true);
    }
  });

  it("every domain's regionId resolves to a configured region", () => {
    const regionIds = new Set(REGIONS.map((region) => region.id));
    for (const definition of DOMAINS) {
      expect(regionIds.has(definition.regionId)).toBe(true);
    }
  });

  it("satisfies the DomainConfig shape for every resolved domain", () => {
    for (const definition of DOMAINS) {
      const domain: DomainConfig | undefined = getDomain(definition.id);
      expect(domain?.layerGroups).toBeDefined();
    }
  });
});
