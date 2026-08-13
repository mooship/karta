import { type RefObject, useRef } from "react";

/**
 * Keeps a ref synced to the latest render's value of something an effect or
 * event listener needs to read at the moment it actually fires, rather than
 * at the moment it was bound.
 * @remarks Assigning `ref.current` directly during render — not inside a
 *   `useEffect` — is the load-bearing part: it keeps the ref current even
 *   for a listener that was bound once (e.g. by a library that only re-runs
 *   its own setup on some other value's change) and would otherwise close
 *   over whichever `value` was current at bind time and go stale.
 */
export function useLatestRef<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
