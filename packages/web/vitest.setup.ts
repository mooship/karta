import "@testing-library/jest-dom/vitest";

/**
 * happy-dom has no `ElementInternals`/`attachInternals()` implementation.
 * `@material/web`'s form-associated behaviour mixin (used by the
 * `md-*` components `@karta/map` renders, e.g. via `ControlButton`)
 * calls `this.attachInternals()` once per custom element instance and
 * caches the result, so every `md-*` element construction throws without
 * this stub. See `packages/map/vitest.setup.ts` for the fuller rationale;
 * duplicated here (rather than shared) since each package's vitest
 * config resolves its own setup file independently.
 */
if (typeof HTMLElement.prototype.attachInternals !== "function") {
  HTMLElement.prototype.attachInternals = function attachInternals() {
    return {
      form: null,
      labels: [],
      states: new Set<string>(),
      role: null,
      ariaLabel: null,
      willValidate: true,
      validity: {} as ValidityState,
      validationMessage: "",
      setFormValue() {},
      setValidity() {},
      checkValidity() {
        return true;
      },
      reportValidity() {
        return true;
      },
    } as unknown as ElementInternals;
  };
}

/**
 * See `packages/map/vitest.setup.ts` for the full rationale: warms
 * `ControlButton`'s dynamically-`import()`ed Material implementation into
 * Vite's module cache up front, so the real `import()` call any test
 * triggers (by rendering `App`, which renders `ControlButton` directly)
 * resolves near-instantly rather than possibly still being in flight when
 * vitest tears down the test file's environment.
 */
await import("../map/src/components/ControlButton/ControlButtonMaterial");
