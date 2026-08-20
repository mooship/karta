import type { DomainStory as DomainStoryContent } from "@karta/core";
import {
  fetchLocationSearchResults,
  formatMeasurementResult,
  getRegisteredBasemapIds,
  type LocationSearchResult,
  type MeasurementMode,
} from "@karta/map";
import type { ThemePreference } from "@karta/react";
import {
  setThemePreference,
  THEME_PREFERENCES,
  useModelContextTool,
} from "@karta/react";
import { getLayer, getLayers } from "../layers/registry";
import { m } from "../paraglide/messages.js";
import { useMapUiStore } from "../stores/useMapUiStore";

/** Wraps `text` as a single-block WebMCP tool result. */
function textResult(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

interface ToggleLayerInput {
  layerId: string;
}

interface SearchLocationInput {
  query: string;
}

interface SetBasemapInput {
  basemap: string;
}

interface SetThemeInput {
  theme: string;
}

interface MeasureLocationsInput {
  locations: string[];
}

/** One `locations` entry from `measure-distance`/`measure-area`, geocoded to a point. */
interface ResolvedMeasurementLocation {
  label: string;
  lat: number;
  lng: number;
}

/**
 * Geocodes each of `locations`, in order, via `fetchLocationSearchResults`,
 * taking the best match for each.
 * @returns Every resolved point (in the same order as `locations`), or the
 *   first query that had no match — `measure-distance`/`measure-area` stop
 *   there rather than silently measuring across whichever locations did
 *   resolve.
 */
async function resolveMeasurementLocations(
  locations: string[],
): Promise<
  { locations: ResolvedMeasurementLocation[] } | { notFoundQuery: string }
> {
  const resolved: ResolvedMeasurementLocation[] = [];
  for (const query of locations) {
    const [best] = await fetchLocationSearchResults(query);
    if (!best) {
      return { notFoundQuery: query };
    }
    resolved.push({
      label: best.label,
      lat: best.latitude,
      lng: best.longitude,
    });
  }
  return { locations: resolved };
}

/** Options for `useMapModelContextTools`, covering the state that stays local to `App`. */
export interface UseMapModelContextToolsOptions {
  /**
   * Handles a location chosen for the map to fly to, mirroring
   * `LocationSearchControl`'s own `onLocationSelect` handling in `App`, and
   * returning a human-readable outcome for the calling agent.
   */
  onLocationSelect: (location: LocationSearchResult) => string;
  /** The active domain's story copy, or `undefined` if it has none — gates whether a story-reading tool is registered at all. */
  story: DomainStoryContent | undefined;
  /** Switches the info panel to the story view and opens it, so a sighted user watching the screen sees what the agent just read. */
  onShowStory: () => void;
  /**
   * Plots a measurement (a line for `"distance"`, a polygon for `"area"`)
   * through `points`, in order, on the map's own measuring tool, mirroring
   * `MapView`'s `measurementRequest` prop — so a sighted user watching the
   * screen sees what the agent just measured, the same way `onShowStory`
   * opens the Story panel for a read-map-story call.
   */
  onRequestMeasurement: (
    mode: MeasurementMode,
    points: { lat: number; lng: number }[],
  ) => void;
}

/**
 * Registers this app's capabilities as WebMCP tools via `document.modelContext`
 * (see `useModelContextTool`), so an in-browser AI agent can list and toggle
 * map layers, search for a place, switch the basemap or theme, read the
 * domain's story, and measure the distance or area across named locations —
 * without reverse-engineering the UI.
 * @remarks A no-op wherever WebMCP is unsupported; `useModelContextTool`
 *   handles that feature detection. Layer, basemap, and theme tools read and
 *   write `useMapUiStore`/the layer registry/`setThemePreference` directly
 *   rather than through props, since all three are already stable, globally
 *   reachable APIs; `onLocationSelect`/`onShowStory`/`onRequestMeasurement`
 *   stay props because they close over `App`'s own local component state
 *   (the search focus target, the panel's open/view state, the measurement
 *   request token) that isn't in the shared store. `measure-distance`/
 *   `measure-area` geocode each given location the same way
 *   `search-map-location` does (`fetchLocationSearchResults`, best match
 *   only) before handing the resolved points to `onRequestMeasurement`, so
 *   the agent's measurement shows up on the same on-screen tool a human's
 *   clicks would drive, rather than being reported as an invisible number.
 */
export function useMapModelContextTools({
  onLocationSelect,
  story,
  onShowStory,
  onRequestMeasurement,
}: UseMapModelContextToolsOptions): void {
  useModelContextTool<Record<string, never>>({
    name: "list-map-layers",
    description: m.webmcp_list_layers_description(),
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    execute: () => {
      const visibleLayerIds = useMapUiStore.getState().visibleLayerIds;
      const lines = getLayers()
        .filter((layer) => layer.available)
        .map((layer) => {
          const visibility = visibleLayerIds.includes(layer.id)
            ? m.webmcp_layer_state_visible()
            : m.webmcp_layer_state_hidden();
          const description = layer.description
            ? ` — ${layer.description}`
            : "";
          return `${layer.id}: ${layer.label}${description} (${visibility})`;
        });
      return textResult(
        lines.length > 0 ? lines.join("\n") : m.webmcp_list_layers_empty(),
      );
    },
  });

  useModelContextTool<ToggleLayerInput>({
    name: "toggle-map-layer",
    description: m.webmcp_toggle_layer_description(),
    inputSchema: {
      type: "object",
      properties: {
        layerId: {
          type: "string",
          description: m.webmcp_toggle_layer_input_layer_id(),
        },
      },
      required: ["layerId"],
      additionalProperties: false,
    },
    execute: ({ layerId }) => {
      const layer = getLayer(layerId);
      if (!layer) {
        return textResult(m.webmcp_toggle_layer_unknown({ layerId }));
      }
      if (!layer.available) {
        return textResult(
          m.webmcp_toggle_layer_unavailable({ label: layer.label }),
        );
      }
      useMapUiStore.getState().toggleLayer(layerId);
      const nowVisible = useMapUiStore
        .getState()
        .visibleLayerIds.includes(layerId);
      return textResult(
        nowVisible
          ? m.webmcp_toggle_layer_now_visible({ label: layer.label })
          : m.webmcp_toggle_layer_now_hidden({ label: layer.label }),
      );
    },
  });

  useModelContextTool<SearchLocationInput>({
    name: "search-map-location",
    description: m.webmcp_search_location_description(),
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: m.webmcp_search_location_input_query(),
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    execute: async ({ query }) => {
      const results = await fetchLocationSearchResults(query);
      const [best] = results;
      if (!best) {
        return textResult(m.webmcp_search_location_not_found({ query }));
      }
      return textResult(onLocationSelect(best));
    },
  });

  useModelContextTool<SetBasemapInput>({
    name: "set-map-basemap",
    description: m.webmcp_set_basemap_description(),
    inputSchema: {
      type: "object",
      properties: {
        basemap: {
          type: "string",
          enum: getRegisteredBasemapIds(),
          description: m.webmcp_set_basemap_input_basemap(),
        },
      },
      required: ["basemap"],
      additionalProperties: false,
    },
    execute: ({ basemap }) => {
      if (!getRegisteredBasemapIds().includes(basemap)) {
        return textResult(m.webmcp_set_basemap_unknown({ basemap }));
      }
      useMapUiStore.getState().setBasemap(basemap);
      return textResult(m.webmcp_set_basemap_switched({ basemap }));
    },
  });

  useModelContextTool<SetThemeInput>({
    name: "set-app-theme",
    description: m.webmcp_set_theme_description(),
    inputSchema: {
      type: "object",
      properties: {
        theme: {
          type: "string",
          enum: THEME_PREFERENCES,
        },
      },
      required: ["theme"],
      additionalProperties: false,
    },
    execute: ({ theme }) => {
      if (!THEME_PREFERENCES.includes(theme as ThemePreference)) {
        return textResult(m.webmcp_set_theme_unknown({ theme }));
      }
      setThemePreference(theme as ThemePreference);
      return textResult(m.webmcp_set_theme_switched({ theme }));
    },
  });

  useModelContextTool(
    story
      ? {
          name: "read-map-story",
          description: m.webmcp_read_story_description(),
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          execute: () => {
            onShowStory();
            return textResult(`${story.title}\n\n${story.body}`);
          },
        }
      : null,
  );

  useModelContextTool<MeasureLocationsInput>({
    name: "measure-distance",
    description: m.webmcp_measure_distance_description(),
    inputSchema: {
      type: "object",
      properties: {
        locations: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          description: m.webmcp_measure_distance_input_locations(),
        },
      },
      required: ["locations"],
      additionalProperties: false,
    },
    execute: async ({ locations }) => {
      if (locations.length < 2) {
        return textResult(m.webmcp_measure_distance_too_few());
      }
      const resolved = await resolveMeasurementLocations(locations);
      if ("notFoundQuery" in resolved) {
        return textResult(
          m.webmcp_search_location_not_found({ query: resolved.notFoundQuery }),
        );
      }
      const points = resolved.locations.map(({ lat, lng }) => ({ lat, lng }));
      onRequestMeasurement("distance", points);
      return textResult(
        m.webmcp_measure_distance_result({
          locations: resolved.locations
            .map((location) => location.label)
            .join(" → "),
          result: formatMeasurementResult("distance", points) ?? "",
        }),
      );
    },
  });

  useModelContextTool<MeasureLocationsInput>({
    name: "measure-area",
    description: m.webmcp_measure_area_description(),
    inputSchema: {
      type: "object",
      properties: {
        locations: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
          description: m.webmcp_measure_area_input_locations(),
        },
      },
      required: ["locations"],
      additionalProperties: false,
    },
    execute: async ({ locations }) => {
      if (locations.length < 3) {
        return textResult(m.webmcp_measure_area_too_few());
      }
      const resolved = await resolveMeasurementLocations(locations);
      if ("notFoundQuery" in resolved) {
        return textResult(
          m.webmcp_search_location_not_found({ query: resolved.notFoundQuery }),
        );
      }
      const points = resolved.locations.map(({ lat, lng }) => ({ lat, lng }));
      onRequestMeasurement("area", points);
      return textResult(
        m.webmcp_measure_area_result({
          locations: resolved.locations
            .map((location) => location.label)
            .join(", "),
          result: formatMeasurementResult("area", points) ?? "",
        }),
      );
    },
  });
}
