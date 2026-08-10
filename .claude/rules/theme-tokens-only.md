# Theme Tokens Only — No Hardcoded Visual Values

Never hardcode visual values in components. Always use tokens from `@shared/theme`.

## Rule

Pull colors, spacing, type sizes and radii from `@shared/theme`:

```ts
import { colors, semantic, spacing, typography, radii } from '@shared/theme';
```

ESLint enforces (error in `mobile/shared/ui/**` and `mobile/modules/**`, warn in `mobile/app/**`):

- No hardcoded hex color literals (`'#059669'`).
- No bare numeric `fontSize` — use `typography.sizes.*`.
- No bare numeric `borderRadius` — use `radii.*`.

## Exception — module accent literals

A module's domain/accent color literal lives in that module's `shared/constants/` (e.g.
`mobile/modules/example-module/shared/constants/exampleModuleAccent.ts`), which is excluded from the
hex rule. That folder is the single allowed home for a module's color literals.

## Why

A token-driven theme means a palette or spacing change happens in one place and propagates
everywhere, and the design stays consistent across screens and modules.
