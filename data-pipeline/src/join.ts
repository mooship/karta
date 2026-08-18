import type { TownshipFeature } from "@karta/app";
import type { NormalizedTownship } from "./adapters/boundaries";
import type { NearestJobCenterResult } from "./osrmClient";

/**
 * Joins each normalized township with its computed drive-time and
 * transit-distance results into a `TownshipFeature`, by array index.
 * @param nearestJobCenters - One result per `townships` entry, same order;
 *   a missing entry (index beyond the array) is treated as "no route found".
 * @param nearestTransitKm - One value per `townships` entry, same order;
 *   defaults to `null` for every township if omitted.
 * @param metroId - The metro (see `@karta/app`'s `METROS`) all of `townships`
 *   belong to, stamped onto every feature — `runRegion` calls this once per
 *   metro, so a single call's townships are always from one metro.
 */
export function joinTownshipData(
  townships: NormalizedTownship[],
  nearestJobCenters: NearestJobCenterResult[],
  nearestTransitKm: (number | null)[] = [],
  metroId: string,
): TownshipFeature[] {
  return townships.map((township, index) => {
    const nearest = nearestJobCenters[index] ?? {
      minutes: null,
      jobCenterId: null,
      jobCenterName: null,
    };
    return {
      type: "Feature",
      geometry: township.geometry,
      properties: {
        id: township.id,
        name: township.name,
        metroId,
        population: township.population,
        commuteMinutes: nearest.minutes,
        nearestJobCenter: nearest.jobCenterName ?? "",
        distanceKm: null,
        nearestTransitKm: nearestTransitKm[index] ?? null,
      },
    };
  });
}
