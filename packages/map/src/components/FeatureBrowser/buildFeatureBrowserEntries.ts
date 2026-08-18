import type { LayerBrowseConfig } from "@karta/core";
import type { FeatureCollection } from "geojson";
import type { FeatureBrowserEntry } from "./FeatureBrowser";

/**
 * Builds `FeatureBrowser` entries from a layer's fetched data, per its
 * `browsable` config.
 * @param resolveGroupLabel - Resolves a raw `groupField` value (e.g. a
 *   metro id) to a display label. Domain-specific, so it's supplied by the
 *   caller rather than assumed here; an entry whose group has no resolved
 *   label falls back to the raw `groupId` itself. Omit for a layer with no
 *   `groupField`, or when the raw id is already display-ready.
 * @returns One entry per feature with a string `id` in `properties.id`
 *   (features without one are skipped); `undefined` `collection` yields no
 *   entries, matching data not yet fetched.
 */
export function buildFeatureBrowserEntries(
  browsable: LayerBrowseConfig,
  collection: FeatureCollection | undefined,
  resolveGroupLabel?: (groupId: string) => string | undefined,
): FeatureBrowserEntry[] {
  if (!collection) {
    return [];
  }
  const labelField = browsable.labelField ?? "name";
  const entries: FeatureBrowserEntry[] = [];
  for (const feature of collection.features) {
    const properties = feature.properties as Record<string, unknown> | null;
    const id = properties?.id;
    if (typeof id !== "string") {
      continue;
    }
    const labelValue = properties?.[labelField];
    const label = typeof labelValue === "string" ? labelValue : id;
    const groupIdValue = browsable.groupField
      ? properties?.[browsable.groupField]
      : undefined;
    const groupId = typeof groupIdValue === "string" ? groupIdValue : undefined;
    entries.push({
      id,
      label,
      groupId,
      groupLabel: groupId
        ? (resolveGroupLabel?.(groupId) ?? groupId)
        : undefined,
    });
  }
  return entries;
}
