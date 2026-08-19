import { type RefObject, useEffect, useRef } from "react";

/**
 * Module-scoped stack of currently-open `useDismissableOverlay` instances,
 * most-recently-opened last. Escape only closes the top of the stack, so
 * two independently-mounted overlays open at once (e.g. a persistent
 * desktop sidebar and a popover opened on top of it) don't both react to
 * the same keypress.
 */
const openOverlayIds: symbol[] = [];

/** Configuration for `useDismissableOverlay`. */
export interface UseDismissableOverlayOptions {
  /** Whether the overlay is currently open. */
  open: boolean;
  /** Called to close the overlay, on Escape or an outside pointerdown. */
  onClose: () => void;
  /** The overlay's own root element; a pointerdown inside it never closes it. */
  containerRef: RefObject<HTMLElement | null>;
  /** The element focus returns to when the overlay closes via Escape. */
  triggerRef: RefObject<HTMLElement | null>;
  /**
   * An element inside the overlay to move focus to when it opens (e.g. its
   * heading). Omit if the overlay manages its own initial focus.
   */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Whether a pointerdown outside `containerRef` closes the overlay.
   * Defaults to `true`. Set `false` for an overlay that also behaves as a
   * persistent, non-popover panel in some layout (e.g. an always-open
   * desktop sidebar) where dismissing it just because the user clicked
   * elsewhere on the page — the map, say — would fight normal use; Escape
   * still closes it either way.
   */
  dismissOnOutsideClick?: boolean;
}

/**
 * Shared open/close behaviour for a disclosure-panel-style overlay
 * (`SettingsMenu`, `MobileLegend`): closes on Escape or (unless
 * `dismissOnOutsideClick` is `false`) a pointerdown outside `containerRef`,
 * restoring focus to `triggerRef`, and moves focus into `initialFocusRef`
 * when the overlay opens.
 * @remarks When more than one overlay using this hook is open at once (e.g.
 *   a persistent desktop panel with a popover like `SettingsMenu` opened on
 *   top of it), Escape only closes the one opened most recently — otherwise
 *   every open overlay's own document-level listener would react to the
 *   same keypress, each fighting to move focus to its own trigger.
 */
export function useDismissableOverlay({
  open,
  onClose,
  containerRef,
  triggerRef,
  initialFocusRef,
  dismissOnOutsideClick = true,
}: UseDismissableOverlayOptions): void {
  const idRef = useRef<symbol | null>(null);
  if (idRef.current === null) {
    idRef.current = Symbol("dismissable-overlay");
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    const id = idRef.current as symbol;
    openOverlayIds.push(id);
    initialFocusRef?.current?.focus();

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      if (openOverlayIds[openOverlayIds.length - 1] !== id) {
        return;
      }
      onClose();
      triggerRef.current?.focus();
    }

    if (dismissOnOutsideClick) {
      document.addEventListener("mousedown", handlePointerDown);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      const index = openOverlayIds.indexOf(id);
      /* v8 ignore next 3 -- unreachable: this cleanup only ever runs after the effect above (unconditionally, before any early return) pushed this exact id, and nothing else in this module ever removes an id from openOverlayIds, so it's always still present here */
      if (index !== -1) {
        openOverlayIds.splice(index, 1);
      }
      if (dismissOnOutsideClick) {
        document.removeEventListener("mousedown", handlePointerDown);
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    open,
    onClose,
    containerRef,
    triggerRef,
    initialFocusRef,
    dismissOnOutsideClick,
  ]);
}
