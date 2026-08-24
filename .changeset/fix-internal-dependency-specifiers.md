---
"@karta/map": patch
---

Depend on sibling SDK packages (`@karta/core`, `@karta/react`, `@karta/theme`) via semver ranges instead of `file:../x` specifiers. `file:` paths only resolve inside this monorepo checkout, so a published `@karta/map` would have had unresolvable dependencies for any external consumer.
