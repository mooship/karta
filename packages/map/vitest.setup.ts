import "@testing-library/jest-dom/vitest";

/**
 * happy-dom has no `ElementInternals`/`attachInternals()` implementation
 * (https://github.com/capricorn86/happy-dom/issues, unresolved as of the
 * version pinned here). `@material/web`'s form-associated behaviour mixin
 * calls `this.attachInternals()` once per custom element instance and
 * caches the result, so every `md-*` element construction throws without
 * this stub. It only needs to satisfy the handful of members that mixin
 * actually touches (see `@material/web/labs/behaviors/form-associated.js`,
 * `constraint-validation.js`, `custom-state-set.js`) — real behaviour
 * (rendering, ripple, focus) is still exercised for real, this only
 * unblocks construction. Full custom element rendering fidelity is
 * verified separately in Playwright e2e, matching how this project
 * already defers real Leaflet rendering to e2e rather than the unit
 * suite (see CLAUDE.md's Testing section).
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
 * `ControlButton` dynamically `import()`s its real `@material/web`
 * implementation from a `useEffect` (see its docs for why not a static or
 * `React.lazy()` import), so any test rendering one — directly or via
 * `IconButton`/`SettingsMenu`/`MobileLegend`/etc. — kicks off a real
 * async module load. If that promise is still in flight when vitest tears
 * down the test file's environment, it throws an unhandled
 * `EnvironmentTeardownError` (harmless — the render already happened —
 * but noisy enough to fail the pre-commit hook). Warming the module into
 * Vite's cache once, up front, means every later `import()` of it
 * resolves near-instantly instead of running a real transform, so it
 * reliably settles within the test that triggered it.
 */
await import("./src/components/ControlButton/ControlButtonMaterial");
