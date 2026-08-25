import type { TollgateProperties } from "@karta/app";
import { m } from "../../paraglide/messages.js";
import * as styles from "../FeaturePopup.css";

interface TollgatePopupProps {
  properties: TollgateProperties;
}

/**
 * Renders a selected toll plaza's popup content: the route it sits on and
 * its operator. Passed (alongside `TownshipPopup`) as part of `App`'s
 * `renderFeaturePopup` dispatch.
 */
export function TollgatePopup({ properties }: TollgatePopupProps) {
  return (
    <div
      className={styles.popup}
      data-testid="tollgate-popup"
      data-e2e="tollgate-popup"
    >
      <h2 className={styles.name}>{properties.name}</h2>
      <dl className={styles.rows}>
        <dt>{m.tollgate_popup_route()}</dt>
        <dd>{properties.route}</dd>
        <dt>{m.tollgate_popup_operator()}</dt>
        <dd>{properties.operator}</dd>
      </dl>
    </div>
  );
}
