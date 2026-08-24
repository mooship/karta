# Releasing the SDK packages

`@karta/core`, `@karta/map`, `@karta/react`, and `@karta/theme` are versioned
independently with [Changesets](https://github.com/changesets/changesets).
`@karta/app` and `@karta/web` are excluded (`.changeset/config.json`'s
`ignore`) — they're the Gauteng reference implementation, deployed
continuously to Cloudflare Workers, not something with a meaningful version
number of its own.

**A "release" here means a bumped `package.json` version, a written
`CHANGELOG.md` entry, a git tag, and a GitHub Release — not an npm publish.**
All four SDK packages stay `private: true`; nothing is pushed to the npm
registry. If that changes in future, only `.changeset/config.json`'s
`access` field and each package's `private` flag need to change — the rest
of this workflow stays the same.

## 1. Add a changeset

When a pull request changes the public behaviour of `@karta/core`,
`@karta/map`, `@karta/react`, or `@karta/theme` — a new export, a changed
signature, a bug fix, a behaviour change a consumer would notice — add a
changeset as part of that PR:

```bash
npx changeset
```

This asks which package(s) changed, whether the bump is patch/minor/major
for each, and for a short summary — then writes a Markdown file to
`.changeset/`. Commit it alongside the code change. A PR that only touches
`packages/app`/`packages/web`, docs, tests, tooling, or CI doesn't need one.

`npx changeset status --since=main` reports what's changed without a
changeset yet, if you want to check before opening a PR. It's read-only —
use it, not `npx changeset version`, to sanity-check a changeset.

**Never run `npx changeset version` or `npx changeset publish` by hand, on
any branch.** Both are destructive to the thing you're trying to commit:
`version` consumes and deletes every pending `.changeset/*.md` file while
bumping `package.json`/writing the changelog, and `publish` tags and
releases whatever `version` already produced. They're `release.yml`'s job,
triggered only by a push to `main` after a Version Packages PR merges — not
something a contributor, or an agent, runs locally to "check the version
bump looks right." If you want to see what a changeset will do, read its
Markdown file, or read the diff of the open Version Packages PR once one
exists.

## 2. Merge to `main`

Nothing else is manual. `.github/workflows/release.yml` runs on every push
to `main`:

- If unreleased changesets exist, it opens (or updates) a **"Version
  Packages"** pull request: every pending changeset consumed, each
  affected package's `package.json` version bumped, and a `CHANGELOG.md`
  entry written per package (via `@changesets/changelog-github`, so entries
  link back to the originating commit/PR).
- Merging that PR back into `main` triggers the same workflow again, this
  time with no pending changesets — it runs the publish step
  (`npm run changeset:release`, i.e. `changeset publish`), which tags each
  newly-versioned package (`privatePackages: { tag: true }` in
  `.changeset/config.json` — normally `changeset publish` skips `private:
  true` packages entirely, this opts them back into tagging without
  attempting an npm publish) and creates a GitHub Release per tag from its
  changelog entry.

You can review the pending version bumps and changelog text at any time by
reading the open "Version Packages" PR's diff before merging it.

## Internal dependency version strings

`packages/app`, `packages/map`, and `packages/web` depend on their sibling
SDK packages via semver ranges (e.g. `"@karta/core": "^1.0.0"`), not a
`file:../core` path — npm workspaces link the local package either way, but
a `file:` specifier only resolves inside this monorepo checkout, so a
published package with one would have unresolvable dependencies for any
external consumer. It also means `updateInternalDependencies: "patch"`
(`.changeset/config.json`) does something real: bumping `@karta/core` bumps
every dependent SDK package's declared range too, as part of the same
"Version Packages" PR.

## A note on `changeset status`'s backlog

`npx changeset status --since=main` will report a large backlog of
"changed but no changeset" packages until this SDK-versioning setup itself
has merged to `main` — every `@karta/core`/`map`/`react`/`theme` change
already on a branch predates Changesets existing, so none of it has a
changeset. That's expected, not a bug in the config: once this work is on
`main`, that becomes the new comparison baseline and `status` reflects only
genuinely new, un-changesetted changes from then on.
