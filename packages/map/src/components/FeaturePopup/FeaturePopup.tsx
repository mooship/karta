import clsx from "clsx";
import { Fragment } from "react";
import styles from "./FeaturePopup.module.css";

/** One label/value row in a `FeaturePopup`. */
export interface FeaturePopupField {
  /** Property key read from `FeaturePopupProps.properties`. */
  key: string;
  /** Localized label shown for this field. */
  label: string;
  /**
   * Formats `properties[key]` for display. Defaults to `String(value)`
   * (`""` for `null`/`undefined`) — a caller with locale-specific formatting
   * (units, number grouping, a "no data" placeholder) supplies its own.
   */
  formatValue?: (value: unknown) => string;
  /**
   * Whether to omit this field's row entirely when its value is `null` or
   * `undefined`, rather than rendering a formatted placeholder. Defaults to
   * `true` — set `false` for a field whose own `formatValue` already turns
   * a missing value into a meaningful placeholder (e.g. "No data").
   */
  hideWhenEmpty?: boolean;
  /** Renders this field's value in the monospace, tabular-figures style used for numeric fields. */
  numeric?: boolean;
}

/** Props for `FeaturePopup`. */
export interface FeaturePopupProps {
  /** The popup's heading, typically the feature's own name. */
  title: string;
  /** The selected feature's raw GeoJSON properties. */
  properties: Record<string, unknown>;
  /** Fields to render as label/value rows, in order. */
  fields: FeaturePopupField[];
}

/**
 * Renders a selected map feature's popup content as a `<dl>` of label/value
 * rows, driven entirely by `fields` — the domain-agnostic generalization of
 * a bespoke per-domain popup component.
 * @remarks A pure function of its props, with no hooks or context: `MapView`
 *   binds a caller's `renderFeaturePopup` via `react-dom/server`'s
 *   `renderToStaticMarkup`, which cannot render a component depending on
 *   either. Locale-specific formatting (units, number grouping, "no data"
 *   placeholders) belongs entirely in each field's own `formatValue`, not in
 *   this component.
 */
export function FeaturePopup({ title, properties, fields }: FeaturePopupProps) {
  return (
    <div
      className={styles.popup}
      data-testid="feature-popup"
      data-e2e="feature-popup"
    >
      <h2 className={styles.name}>{title}</h2>
      <dl className={styles.rows}>
        {fields.map((field) => {
          const value = properties[field.key];
          const hideWhenEmpty = field.hideWhenEmpty ?? true;
          if (hideWhenEmpty && (value === null || value === undefined)) {
            return null;
          }
          const formatted = field.formatValue
            ? field.formatValue(value)
            : String(value ?? "");
          return (
            <Fragment key={field.key}>
              <dt>{field.label}</dt>
              <dd className={clsx(field.numeric && styles.numeric)}>
                {formatted}
              </dd>
            </Fragment>
          );
        })}
      </dl>
    </div>
  );
}
