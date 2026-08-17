import type { TownshipProperties } from "@karta/app";
import { m } from "../../paraglide/messages.js";
import { getLocale } from "../../paraglide/runtime.js";
import { formatCommuteTime } from "../../utils/formatCommuteTime";
import styles from "./TownshipPopup.module.css";

interface TownshipPopupProps {
  properties: TownshipProperties;
}

/**
 * Renders a selected township's popup content: modelled car time, nearest
 * job centre, and (when present) population, straight-line distance, and
 * distance to nearest transit. Passed as `MapView`'s `renderFeaturePopup`.
 */
export function TownshipPopup({ properties }: TownshipPopupProps) {
  return (
    <div
      className={styles.popup}
      data-testid="township-popup"
      data-e2e="township-popup"
    >
      <h2 className={styles.name}>{properties.name}</h2>
      <dl className={styles.rows}>
        <dt>{m.township_popup_car_time()}</dt>
        <dd className={styles.value}>
          {formatCommuteTime(properties.commuteMinutes)}
        </dd>
        <dt>{m.township_popup_job_center()}</dt>
        <dd>{properties.nearestJobCenter}</dd>
        {properties.population !== undefined && (
          <>
            <dt>{m.township_popup_population()}</dt>
            <dd className={styles.value}>
              {properties.population.toLocaleString(getLocale())}
            </dd>
          </>
        )}
        {properties.distanceKm !== null && (
          <>
            <dt>{m.township_popup_distance()}</dt>
            <dd className={styles.value}>
              {m.distance_km({ value: properties.distanceKm.toFixed(1) })}
            </dd>
          </>
        )}
        {properties.nearestTransitKm !== null && (
          <>
            <dt>{m.township_popup_transit_distance()}</dt>
            <dd className={styles.value}>
              {m.distance_km({
                value: properties.nearestTransitKm.toFixed(1),
              })}
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}
