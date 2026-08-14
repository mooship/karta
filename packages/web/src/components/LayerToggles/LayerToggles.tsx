import {
  featureCollectionToCsv,
  fetchFeatureCollection,
  type Layer,
} from "@karta/core";
import { Download, FileSpreadsheet } from "lucide-react";
import { Fragment, useState } from "react";
import { getLayer, getLayerGroups } from "../../layers/registry";
import { m } from "../../paraglide/messages.js";
import styles from "./LayerToggles.module.css";

/** Download filename for one of a layer's `dataSource` URLs, numbering entries past the first. */
function downloadFileName(
  layer: Layer,
  sourceIndex: number,
  extension: string,
): string {
  const suffix = layer.dataSource.length > 1 ? `-${sourceIndex + 1}` : "";
  return `${layer.id}${suffix}.${extension}`;
}

/** Prompts the browser to save `blob` as `fileName`, without navigating away from the page. */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

interface LayerTogglesProps {
  visibleLayerIds: string[];
  onToggle: (id: string) => void;
  /** Ids of layers whose data failed to load, shown with a retry hint badge. */
  failedLayerIds?: string[];
}

/**
 * Renders every layer group from the domain registry as a checkbox list,
 * grouped under its title/description. Each layer shows its own
 * `description`, when it has one, beneath its label. An unavailable layer's
 * checkbox is disabled with a "Not yet available" badge; a failed-to-load
 * visible layer shows a "Failed to load" badge instead.
 * @remarks Every available layer also gets a download link per
 *   `dataSource` URL, so a visitor can save the exact GeoJSON the map
 *   renders, plus a CSV export button that fetches that same URL on click,
 *   flattens its properties (via `@karta/core`'s `featureCollectionToCsv`)
 *   and triggers a browser download — CSV isn't pre-generated like the
 *   static GeoJSON files, since it's a spreadsheet-friendly convenience
 *   format rather than something the map itself consumes. The checkbox's
 *   `<label>` wraps only the checkbox/text/badges, not the download
 *   link/button — nesting them inside that label too would make clicking
 *   them also toggle the checkbox, since a `<label>` forwards any click
 *   within it to its associated control.
 */
export function LayerToggles({
  visibleLayerIds,
  onToggle,
  failedLayerIds = [],
}: LayerTogglesProps) {
  const groups = getLayerGroups();
  const [csvExportStatus, setCsvExportStatus] = useState<
    Record<string, "loading" | "error">
  >({});

  async function handleCsvExport(
    layer: Layer,
    sourceIndex: number,
    url: string,
  ) {
    const key = `${layer.id}-${sourceIndex}`;
    setCsvExportStatus((status) => ({ ...status, [key]: "loading" }));
    try {
      const collection = await fetchFeatureCollection(url);
      downloadBlob(
        new Blob([featureCollectionToCsv(collection)], {
          type: "text/csv;charset=utf-8",
        }),
        downloadFileName(layer, sourceIndex, "csv"),
      );
      setCsvExportStatus((status) => {
        const next = { ...status };
        delete next[key];
        return next;
      });
    } catch {
      setCsvExportStatus((status) => ({ ...status, [key]: "error" }));
    }
  }

  function renderLayer(layerId: string) {
    const layer = getLayer(layerId);
    /* v8 ignore next 3 -- unreachable: every layer group's layerIds is drawn from the same registry, so getLayer always finds a match */
    if (!layer) {
      return null;
    }
    const layerTestId = `layer-toggle-${layer.id}`;
    const labelId = `${layerTestId}-label`;
    const descriptionId = `${layerTestId}-description`;
    const failed = failedLayerIds.includes(layer.id);
    return (
      <li key={layer.id}>
        <div
          className={styles.row}
          data-unavailable={layer.available ? undefined : "true"}
          data-testid={`${layerTestId}-row`}
          data-e2e={`${layerTestId}-row`}
        >
          <label className={styles.rowLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              data-testid={layerTestId}
              data-e2e={layerTestId}
              checked={visibleLayerIds.includes(layer.id)}
              disabled={!layer.available}
              onChange={() => onToggle(layer.id)}
              aria-labelledby={labelId}
              aria-describedby={layer.description ? descriptionId : undefined}
            />
            <span className={styles.label} id={labelId}>
              {layer.label}
            </span>
            {layer.description ? (
              <span
                className={styles.description}
                id={descriptionId}
                data-testid={descriptionId}
                data-e2e={descriptionId}
              >
                {layer.description}
              </span>
            ) : null}
            {layer.available ? null : (
              <span className={styles.badge}>
                {m.layer_unavailable_badge()}
              </span>
            )}
            {layer.available && failed ? (
              <span
                className={styles.badgeError}
                role="status"
                data-testid={`${layerTestId}-error`}
                data-e2e={`${layerTestId}-error`}
              >
                {m.layer_failed_badge()}
              </span>
            ) : null}
          </label>
          {layer.available
            ? layer.dataSource.map((url, sourceIndex) => {
                const csvKey = `${layer.id}-${sourceIndex}`;
                return (
                  <Fragment key={url}>
                    <a
                      className={styles.download}
                      href={url}
                      download={downloadFileName(layer, sourceIndex, "geojson")}
                      aria-label={m.layer_download_aria_label({
                        label: layer.label,
                      })}
                      data-testid={`${layerTestId}-download`}
                      data-e2e={`${layerTestId}-download`}
                    >
                      <Download
                        aria-hidden="true"
                        className={styles.downloadIcon}
                      />
                    </a>
                    <button
                      type="button"
                      className={styles.download}
                      aria-label={m.layer_download_csv_aria_label({
                        label: layer.label,
                      })}
                      data-testid={`${layerTestId}-download-csv`}
                      data-e2e={`${layerTestId}-download-csv`}
                      disabled={csvExportStatus[csvKey] === "loading"}
                      onClick={() => handleCsvExport(layer, sourceIndex, url)}
                    >
                      <FileSpreadsheet
                        aria-hidden="true"
                        className={styles.downloadIcon}
                      />
                    </button>
                    {csvExportStatus[csvKey] === "error" ? (
                      <span
                        className={styles.badgeError}
                        role="status"
                        data-testid={`${layerTestId}-csv-error`}
                        data-e2e={`${layerTestId}-csv-error`}
                      >
                        {m.layer_csv_export_error()}
                      </span>
                    ) : null}
                  </Fragment>
                );
              })
            : null}
        </div>
      </li>
    );
  }

  return (
    <div className={styles.groups}>
      {groups.map((group, index) => (
        <Fragment key={group.id}>
          {index > 0 ? (
            <div className={styles.divider} aria-hidden="true" />
          ) : null}
          <section className={styles.group} aria-label={group.title}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            {group.description ? (
              <p className={styles.groupHint}>{group.description}</p>
            ) : null}
            <ul className={styles.list}>{group.layerIds.map(renderLayer)}</ul>
          </section>
        </Fragment>
      ))}
    </div>
  );
}
