# @karta/map

## 1.0.1

### Patch Changes

- [#92](https://github.com/mooship/karta/pull/92) [`ad9a225`](https://github.com/mooship/karta/commit/ad9a2250451d9a285a7f011ff7ab33d4f4ea64c8) Thanks [@mooship](https://github.com/mooship)! - Depend on sibling SDK packages (`@karta/core`, `@karta/react`, `@karta/theme`) via semver ranges instead of `file:../x` specifiers. `file:` paths only resolve inside this monorepo checkout, so a published `@karta/map` would have had unresolvable dependencies for any external consumer.
