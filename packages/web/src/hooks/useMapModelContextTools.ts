import type { DomainStory as DomainStoryContent } from "@karta/core";
import {
  fetchLocationSearchResults,
  getRegisteredBasemapIds,
  type LocationSearchResult,
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
}

/**
 * Registers this app's capabilities as WebMCP tools via `document.modelContext`
 * (see `useModelContextTool`), so an in-browser AI agent can list and toggle
 * map layers, search for a place, switch the basemap or theme, and read the
 * domain's story — without reverse-engineering the UI.
 * @remarks A no-op wherever WebMCP is unsupported; `useModelContextTool`
 *   handles that feature detection. Layer, basemap, and theme tools read and
 *   write `useMapUiStore`/the layer registry/`setThemePreference` directly
 *   rather than through props, since all three are already stable, globally
 *   reachable APIs; `onLocationSelect`/`onShowStory` stay props because they
 *   close over `App`'s own local component state (the search focus target,
 *   the panel's open/view state) that isn't in the shared store.
 */
export function useMapModelContextTools({
  onLocationSelect,
  story,
  onShowStory,
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
      return {
        content: [
          {
            type: "text",
            text:
              lines.length > 0
                ? lines.join("\n")
                : m.webmcp_list_layers_empty(),
          },
        ],
      };
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
        return {
          content: [
            {
              type: "text",
              text: m.webmcp_toggle_layer_unknown({ layerId }),
            },
          ],
        };
      }
      if (!layer.available) {
        return {
          content: [
            {
              type: "text",
              text: m.webmcp_toggle_layer_unavailable({ label: layer.label }),
            },
          ],
        };
      }
      useMapUiStore.getState().toggleLayer(layerId);
      const nowVisible = useMapUiStore
        .getState()
        .visibleLayerIds.includes(layerId);
      return {
        content: [
          {
            type: "text",
            text: nowVisible
              ? m.webmcp_toggle_layer_now_visible({ label: layer.label })
              : m.webmcp_toggle_layer_now_hidden({ label: layer.label }),
          },
        ],
      };
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
        return {
          content: [
            {
              type: "text",
              text: m.webmcp_search_location_not_found({ query }),
            },
          ],
        };
      }
      return { content: [{ type: "text", text: onLocationSelect(best) }] };
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
        return {
          content: [
            { type: "text", text: m.webmcp_set_basemap_unknown({ basemap }) },
          ],
        };
      }
      useMapUiStore.getState().setBasemap(basemap);
      return {
        content: [
          { type: "text", text: m.webmcp_set_basemap_switched({ basemap }) },
        ],
      };
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
        return {
          content: [
            { type: "text", text: m.webmcp_set_theme_unknown({ theme }) },
          ],
        };
      }
      setThemePreference(theme as ThemePreference);
      return {
        content: [
          { type: "text", text: m.webmcp_set_theme_switched({ theme }) },
        ],
      };
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
            return {
              content: [
                { type: "text", text: `${story.title}\n\n${story.body}` },
              ],
            };
          },
        }
      : null,
  );
}
