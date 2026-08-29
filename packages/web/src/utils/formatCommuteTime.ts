import { m } from "../paraglide/messages.js";

/**
 * Formats a modelled commute time for display.
 * @param minutes Minutes, or `null` if no time was computed.
 * @returns `"No data"` for `null`; `"<n> min"` under an hour; `"<h>h <m>min"` otherwise.
 */
export function formatCommuteTime(minutes: number | null): string {
  if (minutes === null) {
    return m.commute_no_data();
  }
  const rounded = Math.round(minutes);
  if (rounded < 60) {
    return m.commute_minutes({ minutes: rounded });
  }
  const hours = Math.floor(rounded / 60);
  const remainder = rounded % 60;
  return m.commute_hours_minutes({ hours, minutes: remainder });
}
