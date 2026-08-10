# Team Conventions

Baseline conventions for projects scaffolded from this template. Adapt the project-specific parts
(repo name, branch model, board) to your own setup.

## Architecture layers

`app/` → `modules/` → `shared/`. Dependency direction is enforced by ESLint (`eslint-plugin-boundaries`):

- `shared/` imports only from `shared/`.
- `modules/` import from `shared/` (and their own `modules/*/shared/**`).
- `app/` imports from `shared/`, `modules/`, and `app/`.

## Naming

- Components & screens: `PascalCase` (`LoginScreen.tsx`, `AppButton.tsx`).
- Hooks, stores, services: `camelCase` (`useAuthStore.ts`, `StorageService.ts`).
- Module IDs: `kebab-case` (`example-module`).
- Barrel files: `index.ts` re-exporting the folder's public API.

## Before committing

From `mobile/`:

- `pnpm exec tsc --noEmit` passes (0 type errors).
- `pnpm run lint` passes.
- `pnpm test` passes.

## Commits

**Format:** `[emoji] [type]: [description]` (max 50 characters)

### Emoji Types

| Emoji | Type | Use Case | Example |
|-------|------|----------|---------|
| ✨ | feat | New feature | `✨ feat: Add payment module with Stripe` |
| 🐛 | fix | Bug fix | `🐛 fix: Resolve auth token refresh timing` |
| 📚 | docs | Documentation | `📚 docs: Add SQLite migration guide` |
| 🎨 | chore | Configuration/setup | `🎨 chore: Update TypeScript to 5.10.2` |
| ♻️ | refactor | Code refactoring | `♻️ refactor: Extract validation helpers` |
| ⚡ | perf | Performance | `⚡ perf: Optimize store subscriptions` |
| ✅ | test | Tests | `✅ test: Add component render tests` |
| 🚀 | deploy | Deployment | `🚀 deploy: Setup CI/CD pipeline` |

### Rules

- Concise, imperative messages in English
- Maximum 50 characters (emoji + type + description)
- No periods at the end
- Never push without approval; never force-push protected branches

### Examples

```
✨ feat: Initialize TemplateApp with architecture
🐛 fix: Remove unused pnpm configuration
📚 docs: Update CLAUDE.md with full context
🎨 chore: Update TypeScript to 5.10.2
```

## Style

- Follow the other rules in this folder: `screaming-code`, `typescript-no-any`,
 `theme-tokens-only`, `i18n-required`, `service-layer`, `testing-required`.
