import type { Layer, LayerGroup } from "@karta/core";
import { expect } from "vitest";

/**
 * Asserts every layer id a domain's layer groups reference actually exists
 * in that domain's own layer list.
 * @remarks Shared across every domain's `layerGroups.test.ts` so this
 *   invariant — easy to violate silently when a layer is renamed or removed
 *   without updating the group that still points at it — is checked
 *   identically for every domain, current and future, rather than
 *   hand-copied per domain's test file.
 */
export function expectLayerGroupsReferenceKnownLayers(
  layers: readonly Pick<Layer, "id">[],
  layerGroups: readonly Pick<LayerGroup, "layerIds">[],
): void {
  const layerIds = layers.map((layer) => layer.id);
  for (const group of layerGroups) {
    for (const layerId of group.layerIds) {
      expect(layerIds).toContain(layerId);
    }
  }
}
