/**
 * Enforces the SDK package dependency direction documented in CLAUDE.md's
 * "Architecture" section: `packages/core` and `packages/react` are
 * dependency-free foundations, `packages/map` builds on `core`/`react` only,
 * and `packages/app` builds on `core` only -- none of the four may reach
 * into `packages/web` (the reference app) or "downstream" of themselves.
 * Run via `npm run depcruise`; wired into CI as part of `npm run lint`.
 */
module.exports = {
  forbidden: [
    {
      name: "core-is-dependency-free",
      severity: "error",
      comment:
        "packages/core is the SDK's foundational, domain-agnostic package -- CLAUDE.md states it 'has no dependency on packages/app, packages/web, or packages/map ... or React'. An import from here into any of those means the layering has inverted.",
      from: { path: "^packages/core/src" },
      to: { path: "^packages/(app|map|react|web)/src" },
    },
    {
      name: "react-is-dependency-free",
      severity: "error",
      comment:
        "packages/react holds generic hooks with no map/domain dependency, and no dependency on packages/core either (see its own package.json). It must stay a leaf package other SDK packages build on, not the other way round.",
      from: { path: "^packages/react/src" },
      to: { path: "^packages/(app|core|map|web)/src" },
    },
    {
      name: "map-has-no-app-or-web-dependency",
      severity: "error",
      comment:
        "packages/map is generic map rendering built on packages/core and packages/react only -- CLAUDE.md states it 'still has no dependency on packages/app or packages/web', taking DomainConfig/Layer values as props/context instead.",
      from: { path: "^packages/map/src" },
      to: { path: "^packages/(app|web)/src" },
    },
    {
      name: "app-has-no-map-react-or-web-dependency",
      severity: "error",
      comment:
        "packages/app wires up Gauteng-specific domain data on top of packages/core only (see its package.json) -- it must not reach into packages/map, packages/react, or packages/web.",
      from: { path: "^packages/app/src" },
      to: { path: "^packages/(map|react|web)/src" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: "\\.test\\.(ts|tsx)$",
    },
  },
};
