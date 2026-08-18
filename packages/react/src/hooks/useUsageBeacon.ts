import { useCallback, useEffect, useRef } from "react";

const DEFAULT_FLUSH_DELAY_MS = 2000;

/** Options for `useUsageBeacon`. */
export interface UsageBeaconOptions<TEvent> {
  /** Same-origin URL events are POSTed to, as `{ events: TEvent[] }`. */
  endpoint: string;
  /**
   * Returns a stable key for `event`. A later `send` sharing a key with an
   * already-buffered, not-yet-flushed event replaces it rather than adding
   * a second entry — collapsing rapid repeated sends (e.g. a layer toggled
   * on, off, then on again before the buffer flushes) into the one that
   * actually reflects the current state.
   */
  dedupeKey: (event: TEvent) => string;
  /**
   * Milliseconds of inactivity after the most recent `send` before the
   * buffered events are flushed. Defaults to 2000.
   */
  flushDelayMs?: number;
}

/** What `useUsageBeacon` returns. */
export interface UsageBeacon<TEvent> {
  /** Buffers `event`, (re)starting the flush countdown. */
  send: (event: TEvent) => void;
}

/**
 * Generic buffer/debounce/collapse/beacon primitive for best-effort,
 * fire-and-forget usage telemetry — no endpoint- or payload-specific
 * knowledge of its own, matching how `useModelContextTool`/`initTheme` take
 * generic parameters rather than assuming a caller's domain.
 * @remarks Buffered events flush via `navigator.sendBeacon` (survives page
 *   unload without blocking it), falling back to `fetch(endpoint,
 *   { keepalive: true })` when `sendBeacon` is unsupported or reports
 *   failure. A flush also fires immediately when the page becomes hidden
 *   (the `visibilitychange` event, the standard way to catch a tab close or
 *   navigation away before an in-flight debounce timer would otherwise
 *   fire), so a still-buffered event isn't lost to the debounce window
 *   outliving the page. Every send/flush is fire-and-forget: neither
 *   transport's result is awaited or surfaced to the caller, since usage
 *   telemetry must never affect the UI it's reporting on.
 */
export function useUsageBeacon<TEvent>({
  endpoint,
  dedupeKey,
  flushDelayMs = DEFAULT_FLUSH_DELAY_MS,
}: UsageBeaconOptions<TEvent>): UsageBeacon<TEvent> {
  const bufferRef = useRef(new Map<string, TEvent>());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flush = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (bufferRef.current.size === 0) {
      return;
    }
    const events = [...bufferRef.current.values()];
    bufferRef.current = new Map();
    const body = JSON.stringify({ events });

    const sent =
      typeof navigator !== "undefined" &&
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(endpoint, body);
    if (!sent) {
      fetch(endpoint, { method: "POST", body, keepalive: true }).catch(
        () => {},
      );
    }
  }, [endpoint]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        flush();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [flush]);

  const send = useCallback(
    (event: TEvent) => {
      bufferRef.current.set(dedupeKey(event), event);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(flush, flushDelayMs);
    },
    [dedupeKey, flush, flushDelayMs],
  );

  return { send };
}
