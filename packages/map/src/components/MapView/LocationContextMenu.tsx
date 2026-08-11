import type { LatLng } from "leaflet";
import { useState } from "react";
import { Popup, useMapEvents } from "react-leaflet";
import { fetchReverseGeocodeResult } from "../../data/locationSearch";
import { useAbortController } from "../../hooks/useAbortController";
import styles from "./LocationContextMenu.module.css";

interface MenuState {
  latlng: LatLng;
}

interface SearchState {
  loading: boolean;
  label: string | null;
}

/**
 * Shows a small context menu at the point the user right-clicks (desktop) or
 * long-presses (mobile) on the map, offering to reverse-geocode that point.
 * @remarks Bound to Leaflet's `contextmenu` event rather than `click`, for
 *   two reasons: a plain background click can't be told apart from the first
 *   of the two taps that make up double-tap-to-zoom, and Leaflet's vector
 *   layers only bubble `contextmenu` (like `click`) up to the map when
 *   `bubblingMouseEvents` is left at its default `true` -- so a long-press or
 *   right-click over a selectable feature still opens this menu, instead of
 *   that feature's own tap-to-select popup winning. Leaflet already closes
 *   the underlying popup (and this menu with it) on Escape or the next map
 *   click, via `Map`'s `closeOnEscapeKey`/`closePopupOnClick` defaults, so
 *   there's no dismissal logic to duplicate here.
 */
export function LocationContextMenu() {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [search, setSearch] = useState<SearchState | null>(null);
  const { next } = useAbortController();

  useMapEvents({
    contextmenu(event) {
      setMenu({ latlng: event.latlng });
      setSearch(null);
    },
  });

  if (!menu) {
    return null;
  }

  const handleSearchHere = () => {
    const { lat, lng } = menu.latlng;
    const signal = next();

    setSearch({ loading: true, label: null });

    fetchReverseGeocodeResult(lat, lng, signal)
      .then(
        (result) => result?.label ?? null,
        () => null,
      )
      .then((label) => {
        if (!signal.aborted) {
          setSearch({ loading: false, label });
        }
      });
  };

  return (
    <Popup
      position={menu.latlng}
      eventHandlers={{ remove: () => setMenu(null) }}
    >
      {search ? (
        <p className={styles.result} role="status">
          {search.loading
            ? "Looking up address…"
            : (search.label ?? "No address found here.")}
        </p>
      ) : (
        <div
          className={styles.menu}
          role="menu"
          aria-label="Map location actions"
        >
          <button
            type="button"
            role="menuitem"
            className={styles.menuItem}
            onClick={handleSearchHere}
          >
            Search this location
          </button>
        </div>
      )}
    </Popup>
  );
}
