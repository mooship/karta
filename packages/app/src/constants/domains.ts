import type { DomainConfig } from "@karta/core";
import { GAUTENG_SPATIAL_LEGACY_DOMAIN } from "../domains/gauteng-spatial-legacy";
import { HERITAGE_SITES_DOMAIN } from "../domains/heritage-sites";
import type { RegionId } from "./regions";

/**
 * Metadata for one registered domain, mirroring `RegionDefinition`
 * (`./regions.ts`). Deliberately holds only what a domain switcher needs
 * (id, label, and the region its data lives under) rather than the domain's
 * full `layers`/`layerGroups`/`story` — see `getDomain` for the latter, kept
 * as a separate lookup so a caller that only needs switcher metadata (e.g.
 * `DomainSwitcher`) doesn't pull in every registered domain's layer
 * catalogue just to render a nav.
 */
export interface DomainDefinition {
  id: string;
  /** The `REGIONS` entry whose `/data/<regionId>/` directory this domain's layers read from. */
  regionId: RegionId;
  label: string;
}

/**
 * A domain's full config, as exported by its own module
 * (`domains/<id>/index.ts`) — `DomainConfig` plus the `id` field every
 * domain module adds beyond what `DomainConfig` itself requires.
 */
export interface RegisteredDomain extends DomainConfig {
  id: string;
}

/**
 * The domains this reference implementation registers. Adding a domain here
 * (and to the parallel `DOMAIN_CONFIGS` map below) is the only step needed
 * to make it reachable via `/d/<id>` and the domain switcher — no other SDK
 * or app package branches on a domain id.
 */
export const DOMAINS: readonly DomainDefinition[] = [
  {
    id: "gauteng-spatial-legacy",
    regionId: "gauteng",
    label: "Spatial legacy",
  },
  {
    id: "heritage-sites",
    regionId: "south-africa",
    label: "Heritage sites",
  },
] as const satisfies readonly DomainDefinition[];

/**
 * Union of the ids actually configured in `DOMAINS`, derived from `DOMAINS`
 * itself rather than hand-typed — mirrors `RegionId`'s relationship to
 * `REGIONS`.
 */
export type DomainId = (typeof DOMAINS)[number]["id"];

/** The domain served at `/` and used when no domain id is otherwise known. */
export const DEFAULT_DOMAIN_ID: DomainId = "gauteng-spatial-legacy";

/** Looks up a domain's switcher metadata by id, or `undefined` if `id` isn't configured. */
export function getDomainDefinition(id: string): DomainDefinition | undefined {
  return DOMAINS.find((domain) => domain.id === id);
}

/**
 * Maps each `DOMAINS` id to its full `RegisteredDomain`. Kept as a separate
 * structure from `DOMAINS` (see `DomainDefinition`'s remarks); `domains.test.ts`
 * guards the two from drifting apart, since nothing here enforces that
 * every `DOMAINS` entry has a matching config, or vice versa, at the type
 * level.
 */
const DOMAIN_CONFIGS: Record<DomainId, RegisteredDomain> = {
  "gauteng-spatial-legacy": GAUTENG_SPATIAL_LEGACY_DOMAIN,
  "heritage-sites": HERITAGE_SITES_DOMAIN,
};

/** Returns the full `RegisteredDomain` for a registered domain id, or `undefined` if `id` isn't configured. */
export function getDomain(id: string): RegisteredDomain | undefined {
  return DOMAIN_CONFIGS[id as DomainId];
}
