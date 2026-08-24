# Changesets

This folder is managed by [`@changesets/cli`](https://github.com/changesets/changesets). It versions and changelogs the four SDK packages — `@karta/core`, `@karta/map`, `@karta/react`, `@karta/theme` — independently of each other and of `@karta/app`/`@karta/web` (the reference implementation, deployed continuously rather than released).

See [`docs/releasing.md`](../docs/releasing.md) for the full workflow: when to add a changeset, how versioning happens, and what a release actually is here (versioned `package.json` + changelog + a tagged GitHub Release — these packages are not published to npm).
