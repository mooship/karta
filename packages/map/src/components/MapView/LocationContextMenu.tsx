import type { LatLng } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { Popup, useMapEvents } from "react-leaflet";
import { fetchReverseGeocodeResult } from "../../data/locationSearch";
import { useAbortController } from "../../hooks/useAbortController";
import styles from "./LocationContextMenu.module.css";

interface SearchState {
  loading: boolean;
  label: string | null;
}

interface MenuState {
  latlng: LatLng;
  search: SearchState | null;
}

const GHOST_CLICK_MAX_DISTANCE_PX = 20;
const GHOST_CLICK_SUPPRESSION_MS = 500;

/**
 * Consumes the next `click` anywhere in the document if it lands within
 * `GHOST_CLICK_MAX_DISTANCE_PX` of `origin` and outside `menuContentRef`'s
 * element, then disarms itself (on that click, or after
 * `GHOST_CLICK_SUPPRESSION_MS` if none arrives).
 * @remarks On most touchscreens, the `touchend` that ends a long press is
 *   still turned into a synthetic `click` at (near enough) the same point
 *   once the finger lifts, and Leaflet's `Popup` closes itself on the very
 *   next map click by default (`closeOnClick`) -- so without this, the menu
 *   this same long-press just opened closes again before the point ever
 *   registers with the user. Consuming just that one click, in the capture
 *   phase before it ever reaches Leaflet's own listener on the map
 *   container, is the same trick Leaflet's own `Map.TapHold` handler uses
 *   for the equivalent problem on mobile Safari (its `_cancelClickPrevent`);
 *   this generalises it to every touchscreen browser that does this, not
 *   just Safari. Both conditions matter: distance alone would risk
 *   swallowing a genuine tap on the menu's own button if Leaflet happens to
 *   render the popup close to the anchor on a given screen size, while
 *   containment alone can't tell a same-gesture ghost click apart from a
 *   deliberate tap somewhere else on the map moments later (e.g. to dismiss
 *   the menu without choosing an action) -- only a click that's both close
 *   to the long-press point *and* outside the menu is the ghost click this
 *   exists to catch.
 */
function armGhostClickGuard(
  origin: { clientX: number; clientY: number },
  menuContentRef: { current: HTMLElement | null },
  cleanupRef: { current: (() => void) | null },
): void {
  cleanupRef.current?.();

  const handleClick = (event: MouseEvent) => {
    disarm();
    const target = event.target;
    const insideMenu =
      target instanceof Node &&
      (menuContentRef.current?.contains(target) ?? false);
    const distance = Math.hypot(
      event.clientX - origin.clientX,
      event.clientY - origin.clientY,
    );
    if (!insideMenu && distance <= GHOST_CLICK_MAX_DISTANCE_PX) {
      event.stopPropagation();
    }
  };

  function disarm() {
    window.clearTimeout(timeoutId);
    document.removeEventListener("click", handleClick, true);
    cleanupRef.current = null;
  }

  const timeoutId = window.setTimeout(disarm, GHOST_CLICK_SUPPRESSION_MS);
  document.addEventListener("click", handleClick, true);
  cleanupRef.current = disarm;
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
 *   there's no dismissal logic to duplicate here -- beyond `armGhostClickGuard`
 *   above, which stops the long-press's own release from counting as that
 *   "next click" and closing the menu before it's even seen. Any in-flight
 *   reverse-geocode lookup is aborted both when the menu reopens elsewhere
 *   and when it's dismissed, so a slow response can't overwrite a later
 *   (or no longer open) menu with a stale result.
 */
export function LocationContextMenu() {
  const [menu, setMenu] = useState<MenuState | null>(null);
  const { next, abort } = useAbortController();
  const ghostClickGuardRef = useRef<(() => void) | null>(null);
  const menuContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      ghostClickGuardRef.current?.();
    };
  }, []);

  useMapEvents({
    contextmenu(event) {
      abort();
      if (event.originalEvent) {
        armGhostClickGuard(
          event.originalEvent,
          menuContentRef,
          ghostClickGuardRef,
        );
      }
      setMenu({ latlng: event.latlng, search: null });
    },
  });

  const handleClosed = useCallback(() => {
    abort();
    setMenu(null);
  }, [abort]);

  if (!menu) {
    return null;
  }

  const handleSearchHere = () => {
    // Deferred to a macrotask so this handler's own state update -- which
    // replaces this very button with the loading/result text -- can't commit
    // until well after the native click that invoked it has finished
    // propagating. React's own click-dispatch machinery runs (and flushes
    // that DOM change) before Leaflet's bubble-phase listener on the map
    // container gets a turn, even though that listener sits closer to the
    // target in the DOM -- and empirically, deferring only to a microtask
    // isn't enough to land after it, so this needs a full `setTimeout`, not
    // `queueMicrotask`. Leaflet's own click-vs-popup-content check
    // (`_isClickDisabled`) walks the clicked element's live `parentNode`
    // chain looking for the popup's container -- if this button is already
    // detached by the time that runs, the walk comes up empty, Leaflet
    // treats the click as an ordinary background one, and closes the popup
    // this same click was meant to act on.
    setTimeout(() => {
      const { lat, lng } = menu.latlng;
      const signal = next();

      setMenu(
        (current) =>
          current && { ...current, search: { loading: true, label: null } },
      );

      fetchReverseGeocodeResult(lat, lng, signal)
        .then(
          (result) => result?.label ?? null,
          () => null,
        )
        .then((label) => {
          if (!signal.aborted) {
            setMenu(
              (current) =>
                current && { ...current, search: { loading: false, label } },
            );
          }
        });
    }, 0);
  };

  return (
    <Popup position={menu.latlng} eventHandlers={{ remove: handleClosed }}>
      <div
        ref={menuContentRef}
        data-testid="location-context-menu"
        data-e2e="location-context-menu"
      >
        {menu.search ? (
          <output className={styles.result}>
            {menu.search.loading
              ? "Looking up address…"
              : (menu.search.label ?? "No address found here.")}
          </output>
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
      </div>
    </Popup>
  );
}
