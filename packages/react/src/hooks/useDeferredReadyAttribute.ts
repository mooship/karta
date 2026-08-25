import { type RefObject, useCallback, useEffect, useRef } from "react";

/** Ref/callback pair returned by `useDeferredReadyAttribute`. */
export interface DeferredReadyAttribute<T extends Element> {
  /** Attach to the element the paired CSS rule reads `attribute` from. */
  ref: RefObject<T | null>;
  /** Sets `attribute="false"` on `ref.current` synchronously, cancelling any pending `markReadyAfterPaint` call. */
  markNotReady: () => void;
  /** Waits two animation frames, then sets `attribute="true"` on `ref.current`. */
  markReadyAfterPaint: () => void;
}

/**
 * Defers flipping a DOM attribute to `"true"` until two animation frames
 * after it's requested, for pairing with a CSS rule (e.g.
 * `[data-foo-ready="true"] .bar { animation-play-state: running; }`) that
 * starts a CSS animation paused and only lets it begin ticking once
 * synchronous work triggered in the same commit (typically laying out
 * content revealed for the first time) has settled.
 * @param attribute - The attribute name to toggle, e.g. `"data-sheet-entrance-ready"`.
 * @remarks A CSS `animation`'s clock is anchored to when it's associated
 *   with the element, not to when it's first painted -- if synchronous work
 *   triggered in the same commit delays that first paint, the animation can
 *   appear to have already raced ahead of where a user expects it to be by
 *   the time it's actually visible. Two `requestAnimationFrame` calls, not
 *   one, because a single one can still fire before the browser has
 *   committed this render's own layout; the second one only runs once a
 *   real frame has already been painted. Mutates the DOM attribute directly
 *   rather than through React state, since a paired CSS rule is the only
 *   consumer -- funnelling it through `useState` would re-render the whole
 *   tree for a value nothing else branches on. Cancels any pending frame(s)
 *   on unmount, so a `markReadyAfterPaint` chain still in flight when the
 *   component unmounts doesn't call `setAttribute` on a ref whose element is
 *   already gone.
 * @example
 * const { ref, markNotReady, markReadyAfterPaint } =
 *   useDeferredReadyAttribute("data-sheet-entrance-ready");
 * // on opening:
 * markNotReady();
 * setPanelOpen(true);
 * markReadyAfterPaint();
 * // <div ref={ref}> ... </div>
 */
export function useDeferredReadyAttribute<T extends Element = HTMLElement>(
  attribute: string,
): DeferredReadyAttribute<T> {
  const ref = useRef<T>(null);
  const outerFrameRef = useRef<number | null>(null);
  const innerFrameRef = useRef<number | null>(null);

  const cancelPending = useCallback(() => {
    if (outerFrameRef.current !== null) {
      cancelAnimationFrame(outerFrameRef.current);
      outerFrameRef.current = null;
    }
    if (innerFrameRef.current !== null) {
      cancelAnimationFrame(innerFrameRef.current);
      innerFrameRef.current = null;
    }
  }, []);

  const markNotReady = useCallback(() => {
    cancelPending();
    ref.current?.setAttribute(attribute, "false");
  }, [attribute, cancelPending]);

  const markReadyAfterPaint = useCallback(() => {
    cancelPending();
    outerFrameRef.current = requestAnimationFrame(() => {
      outerFrameRef.current = null;
      innerFrameRef.current = requestAnimationFrame(() => {
        innerFrameRef.current = null;
        ref.current?.setAttribute(attribute, "true");
      });
    });
  }, [attribute, cancelPending]);

  useEffect(() => {
    return cancelPending;
  }, [cancelPending]);

  return { ref, markNotReady, markReadyAfterPaint };
}
