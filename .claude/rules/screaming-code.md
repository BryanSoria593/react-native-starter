# Screaming Code — Names Declare Intent

Every identifier states its full intention. Code should read like prose.

## Rule

Prohibited:
- Abbreviations (`btn`, `msg`, `cfg`, `usr`).
- Generic placeholders (`data`, `item`, `val`, `temp`, `obj`, `res`).
- Single-letter variables outside short mathematical loops.

Required:
- Functions are verbs: `getEnabledModules()`, `registerModule()`, `rehydratePersistedStores()`.
- Booleans read as predicates: `hasRequiredFields`, `isAuthenticated`, `isSubmitting`.
- Values name what they hold: `trimmedUsername`, `errorMessageKey`, `moduleDefinition`.

## Examples

```ts
// WRONG:
const d = getEnabledModules();
d.map((m) => ...);

// CORRECT:
const enabledModules = getEnabledModules();
enabledModules.map((moduleDefinition) => ...);
```

## Why

Intent-revealing names remove the need for comments that restate the code, make reviews faster, and
keep the codebase legible as it grows.
