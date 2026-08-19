import { useCallback, useRef } from "react";

/** `schedule`/`cancel` pair returned by `useRafScheduledValue`. */
export interface RafScheduledValue<T> {
  /** Queues `value` for `setValue`, coalescing any burst within the same animation frame into one call. */
  schedule: (value: T) => void;
  /** Cancels a pending scheduled call, if any. */
  cancel: () => void;
}

/**
 * Batches rapid updates to a React state setter to at most one call per
 * animation frame.
 * @param setValue - Typically a `useState` setter. Called with the latest
 *   value `schedule` was given for a frame, not every intermediate one.
 * @remarks The shared implementation behind every "coalesce a burst of
 *   native pointermove/mousemove events into one state update per frame"
 *   spot in this package (`useSwipeToDismiss`'s drag offset,
 *   `MeasurementLayer`'s hover-preview point) — hand-rolling the same
 *   pending-ref/frame-ref bookkeeping at each call site meant a fix or
 *   subtlety found in one never reached the others.
 * @example
 * const { schedule, cancel } = useRafScheduledValue(setDragOffsetPx);
 * // in a pointermove handler: schedule(nextOffset);
 * // on cleanup: cancel();
 */
export function useRafScheduledValue<T>(
  setValue: (value: T) => void,
): RafScheduledValue<T> {
  const pendingRef = useRef<T | undefined>(undefined);
  const frameRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const schedule = useCallback(
    (value: T) => {
      pendingRef.current = value;
      if (frameRef.current !== null) {
        return;
      }
      frameRef.current = requestAnimationFrame(() => {
        setValue(pendingRef.current as T);
        frameRef.current = null;
      });
    },
    [setValue],
  );

  return { schedule, cancel };
}
