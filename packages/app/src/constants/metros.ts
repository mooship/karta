import type { RegionId } from "./regions";

/** Identifier for one of the metros the SDK's reference domain covers. */
export type MetroId =
  | "tshwane"
  | "johannesburg"
  | "ekurhuleni"
  | "emfuleni"
  | "midvaal"
  | "lesedi"
  | "mogale-city"
  | "rand-west-city"
  | "merafong-city"
  | "cape-town";

/** Metadata describing one metro used to build and render its region's dataset. */
export interface MetroDefinition {
  id: MetroId;
  name: string;
  shortName: string;
  regionId: RegionId;
  /**
   * Census 2011 municipality codes, used by the data pipeline to filter the
   * national boundary shapefile down to this metro's features (see
   * `filterFeaturesByMunicipality` in `data-pipeline/src/adapters/boundaries.ts`).
   */
  municipalityCodes: readonly number[];
  /**
   * Hand-maintained mirror of `getJobCentersForMetro(id).length` in
   * `data-pipeline/src/constants/jobCenters.ts`. `data-pipeline`'s
   * `assertMetroSetup` cross-checks the two on every pipeline run and throws
   * on drift, so an edit to one that isn't kept in sync with the other fails
   * loudly rather than silently under/over-counting a metro's job centres.
   */
  jobCenterCount: number;
}

/** The nine Gauteng municipalities and City of Cape Town covered by the `spatial-apartheid-legacy` domain. */
export const METROS: readonly MetroDefinition[] = [
  {
    id: "tshwane",
    name: "City of Tshwane",
    shortName: "Tshwane",
    regionId: "gauteng",
    municipalityCodes: [799],
    jobCenterCount: 8,
  },
  {
    id: "johannesburg",
    name: "City of Johannesburg",
    shortName: "Johannesburg",
    regionId: "gauteng",
    municipalityCodes: [798],
    jobCenterCount: 8,
  },
  {
    id: "ekurhuleni",
    name: "City of Ekurhuleni",
    shortName: "Ekurhuleni",
    regionId: "gauteng",
    municipalityCodes: [797],
    jobCenterCount: 6,
  },
  {
    id: "emfuleni",
    name: "Emfuleni Local Municipality",
    shortName: "Emfuleni",
    regionId: "gauteng",
    municipalityCodes: [760],
    jobCenterCount: 6,
  },
  {
    id: "midvaal",
    name: "Midvaal Local Municipality",
    shortName: "Midvaal",
    regionId: "gauteng",
    municipalityCodes: [761],
    jobCenterCount: 6,
  },
  {
    id: "lesedi",
    name: "Lesedi Local Municipality",
    shortName: "Lesedi",
    regionId: "gauteng",
    municipalityCodes: [762],
    jobCenterCount: 6,
  },
  {
    id: "mogale-city",
    name: "Mogale City Local Municipality",
    shortName: "Mogale City",
    regionId: "gauteng",
    municipalityCodes: [763],
    jobCenterCount: 6,
  },
  {
    id: "rand-west-city",
    name: "Rand West City Local Municipality",
    shortName: "Rand West City",
    regionId: "gauteng",
    municipalityCodes: [764, 765],
    jobCenterCount: 6,
  },
  {
    id: "merafong-city",
    name: "Merafong City Local Municipality",
    shortName: "Merafong City",
    regionId: "gauteng",
    municipalityCodes: [766],
    jobCenterCount: 6,
  },
  {
    id: "cape-town",
    name: "City of Cape Town",
    shortName: "Cape Town",
    regionId: "western-cape",
    municipalityCodes: [199],
    jobCenterCount: 7,
  },
] as const satisfies readonly MetroDefinition[];

/**
 * Looks up a metro's definition by id.
 * @throws If `id` isn't one of `METROS`'s ids.
 */
export function getMetroDefinition(id: MetroId): MetroDefinition {
  const metro = METROS.find((candidate) => candidate.id === id);
  if (!metro) {
    throw new Error(`Unknown metro id: ${id}`);
  }
  return metro;
}
