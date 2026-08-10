# React Native Starter

> Production-ready React Native (Expo) starter template. Modern architecture, vibrant design system, comprehensive documentation.

Build scalable mobile apps with enforced layering, semantic theming, and 13 non-negotiable development rules.

## Features

- ✅ Scalable three-layer architecture: `app/` → `modules/` → `shared/`
- ✅ Expo 55 + React 19 + TypeScript in strict mode
- ✅ Working demo: Login → Home → Example Module
- ✅ i18n configured (Spanish/English) with `i18n-js`
- ✅ State management with Zustand + persistence (AsyncStorage via service layer)
- ✅ React Navigation 7 (native-stack + bottom-tabs)
- ✅ Centralized token-based theming (`@shared/theme`) with dark/light mode
- ✅ ESLint (with `eslint-plugin-boundaries`), Prettier, and Jest pre-configured
- ✅ 13 development rules in `.claude/rules/` (enforced by linting)

## Quick Start

```bash
pnpm install
pnpm start          # Starts Metro / Expo
# Then: a (Android), i (iOS), w (web)
```

Run these checks before committing:

```bash
pnpm exec tsc --noEmit   # Type check
pnpm run lint            # Linting
pnpm test                # Unit tests
```

## Demo Credentials

- Username: `admin`
- Password: `1234`

> The login is a local demo (no backend). Replace `shared/stores/useAuthStore.ts` with your
> real authentication service when implementing for production.

## Repository Structure

```
.claude/rules/  # 13 non-negotiable development rules
app/            # Composition: navigation, providers, screens, module registry
modules/        # Feature modules (example: example-module)
shared/         # Theme, i18n, stores, services, ui, types, constants, hooks
test/           # Unit tests, component tests, and mocks
CLAUDE.md       # Complete technical documentation
HANDOFF.md      # Architectural decisions and rationale
```

## Native Folders (Android / iOS)

The `android/` and `ios/` directories **are versioned** (may contain custom native code).
They don't exist yet — generate them once with `expo prebuild` and then commit.

```bash
npx expo prebuild        # Generates android/ and ios/ from app.json + plugins
```

`.gitignore` excludes only **build artifacts** (`build/`, `.gradle/`, `Pods/`, 
`local.properties`, keystores…) and preserves native source code. Before running `prebuild`, 
develop using Expo Go.

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Complete technical reference and architecture guide
- **[HANDOFF.md](./HANDOFF.md)** — Architectural decisions, design rationale, and context
- **[`.claude/rules/`](./.claude/rules/)** — The 13 development rules (detailed explanations)
