import type { Layer } from "@karta/core";

/**
 * The `heritage-sites` domain's layer catalogue: a single Point layer of
 * publicly documented anti-apartheid and democracy heritage sites spanning
 * multiple South African provinces, hand-authored rather than produced by
 * `data-pipeline` (unlike `spatial-apartheid-legacy`, there is no fetcher or
 * routing step behind this data — see the domain's `index.ts` for why).
 * Exercises `PointLayerStyle` with a `categorized` `colorClassification`,
 * a style path `spatial-apartheid-legacy` never uses, and — being national
 * rather than province-scoped — shows that neither `Layer` nor
 * `DomainConfig` has any notion of region or metro baked in.
 * @remarks `readonly`/`as const`, matching `METROS`/`REGIONS`: Cloudflare
 *   Workers reuse isolates across requests, so an in-place mutation by any
 *   downstream consumer would otherwise leak across unrelated requests for
 *   the isolate's lifetime.
 */
export const HERITAGE_SITES_LAYERS: readonly Layer[] = [
  {
    id: "heritage-sites",
    label: "Struggle heritage sites",
    description:
      "Approximate locations of publicly documented sites significant to South Africa's anti-apartheid and democracy history.",
    dataSource: ["/data/heritage-sites/heritage-sites.geojson"],
    geometryKind: "point",
    defaultVisible: true,
    available: true,
    interaction: {
      selectable: true,
      labelField: "name",
      popupFields: ["category", "summary"],
    },
    style: {
      kind: "point",
      color: "#3673B8",
      radius: 7,
      legendLabel: "Struggle heritage sites",
      colorClassification: {
        kind: "categorized",
        propertyKey: "category",
        stops: [
          { match: "memorial", value: "#C1502E", label: "Memorial" },
          { match: "museum", value: "#3673B8", label: "Museum" },
          {
            match: "heritage-site",
            value: "#7A9B6E",
            label: "Heritage site",
          },
        ],
        fallback: "#3673B8",
      },
    },
  },
] as const satisfies readonly Layer[];
