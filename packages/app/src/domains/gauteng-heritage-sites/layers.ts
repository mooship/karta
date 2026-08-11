import type { Layer } from "@karta/core";

/**
 * The `gauteng-heritage-sites` domain's layer catalogue: a single Point
 * layer of publicly documented anti-apartheid and democracy heritage sites
 * across Gauteng's metros, hand-authored rather than produced by
 * `data-pipeline` (unlike `gauteng-spatial-legacy`, there is no fetcher or
 * routing step behind this data — see the domain's `index.ts` for why).
 * Exercises `PointLayerStyle` with a `categorized` `colorClassification`,
 * a style path `gauteng-spatial-legacy` never uses.
 */
export const GAUTENG_HERITAGE_SITES_LAYERS: Layer[] = [
  {
    id: "heritage-sites",
    label: "Struggle heritage sites",
    description:
      "Approximate locations of publicly documented sites significant to Gauteng's anti-apartheid and democracy history.",
    dataSource: ["/data/gauteng-heritage-sites/heritage-sites.geojson"],
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
];
