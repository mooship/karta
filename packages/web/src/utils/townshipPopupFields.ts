import type { FeaturePopupField } from "@karta/map";
import { m } from "../paraglide/messages.js";
import { getLocale } from "../paraglide/runtime.js";
import { formatCommuteTime } from "./formatCommuteTime";

/** Formats a kilometre figure to one decimal place using the active locale's decimal separator. */
function formatDistanceKm(km: number): string {
  return km.toLocaleString(getLocale(), {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Field configuration for `@karta/map`'s `FeaturePopup`, rendering a
 * selected township's modelled car time, nearest job centre, and (when
 * present) population, straight-line distance, and distance to nearest
 * transit.
 * @remarks Must be called fresh at popup-render time, not cached — every
 *   `formatValue` reads the active request's locale via `getLocale()`, the
 *   same per-request (not module-scope) discipline `layers/registry.ts`
 *   documents for Cloudflare Workers' isolate reuse.
 */
export function getTownshipPopupFields(): FeaturePopupField[] {
  return [
    {
      key: "commuteMinutes",
      label: m.township_popup_car_time(),
      hideWhenEmpty: false,
      numeric: true,
      formatValue: (value) => formatCommuteTime(value as number | null),
    },
    {
      key: "nearestJobCenter",
      label: m.township_popup_job_center(),
    },
    {
      key: "population",
      label: m.township_popup_population(),
      numeric: true,
      formatValue: (value) => (value as number).toLocaleString(getLocale()),
    },
    {
      key: "distanceKm",
      label: m.township_popup_distance(),
      numeric: true,
      formatValue: (value) =>
        m.distance_km({ value: formatDistanceKm(value as number) }),
    },
    {
      key: "nearestTransitKm",
      label: m.township_popup_transit_distance(),
      numeric: true,
      formatValue: (value) =>
        m.distance_km({ value: formatDistanceKm(value as number) }),
    },
  ];
}
