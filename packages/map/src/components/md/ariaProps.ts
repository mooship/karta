/**
 * Coerces boolean-valued `aria-*` props to their spec-required `"true"`/
 * `"false"` string form.
 *
 * @remarks
 * React knows to stringify ARIA boolean attributes (`aria-expanded={true}`
 * → `aria-expanded="true"`) only for elements it has built-in DOM property
 * knowledge of. For a custom element tag (any name containing a `-`),
 * React instead passes most props through close to raw — a bare boolean
 * `true` serializes as a presence attribute (`aria-expanded=""`) rather
 * than the string `"true"` a real browser's ARIA reflection and
 * `@material/web`'s own `aria-*` handling both require. Every `md/`
 * wrapper component that forwards caller-supplied `aria-*` props (as
 * opposed to ones it always sets itself, like `aria-label` above) must
 * route them through this first.
 */
export function normalizeAriaBooleanProps<T extends Record<string, unknown>>(
  props: T,
): T {
  const normalized: Record<string, unknown> = { ...props };
  for (const key of Object.keys(normalized)) {
    if (key.startsWith("aria-") && typeof normalized[key] === "boolean") {
      normalized[key] = String(normalized[key]);
    }
  }
  return normalized as T;
}
