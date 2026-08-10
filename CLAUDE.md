# CLAUDE.md — React Native Starter

**Production-ready React Native (Expo) starter template** for building scalable mobile applications from scratch.

Every application derived from this template MUST follow 100% the standards defined in `.claude/rules/`. This document provides the complete technical context, architecture decisions, and guidelines for development.

## Repository Structure

```
.claude/
├── rules/           # 13 non-negotiable development rules

app/               # Composition: navigation, providers, screens, module registry
modules/           # Feature modules (auth, payments, etc.) — independently deliverable
shared/            # Global: theme, i18n, stores, services, types, ui, hooks
test/              # All tests: unit, component, e2e, mocks

package.json       # Dependencies with EXACT versions (no ^ or ~)
.npmrc             # pnpm strict enforcement
app.json           # Expo configuration
tsconfig.json      # TypeScript strict mode
eslint.config.js   # ESLint with boundary enforcement
jest.config.js     # Jest test configuration
CLAUDE.md          # This file — technical context & guidelines
HANDOFF.md         # Decisions, rationale, and architectural context
README.md          # Project overview & quick start
```

**All commands execute from repository root.**

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Expo | 55.0.26 | Framework bridge (native ↔ JS) |
| **Framework** | React Native | 0.83.6 | Mobile UI framework |
| **UI Library** | React | 19.2.0 | Component system |
| **Type System** | TypeScript | 5.9.2 | Strict type safety |
| **Navigation** | React Navigation | 7.1.33 | Native stack + bottom tabs |
| **State** | Zustand | 5.0.11 | Global store with persistence |
| **i18n** | i18n-js | 4.5.3 | Spanish/English translations |
| **Storage** | AsyncStorage | 2.2.0 | Async key-value store |
| **SecureStore** | Expo SecureStore | Via Expo | Token/credential vault |
| **Database** | SQLite | expo-sqlite | Structured persistence |
| **HTTP Client** | Fetch API | Native | REST/JSON requests |
| **Testing** | Jest | 29.7.0 | Unit + component tests |
| **Testing UI** | @testing-library/react-native | 13.3.3 | Component test utilities |
| **Linting** | ESLint 9 + eslint-plugin-boundaries | 9.25.0 | Code quality + layering |
| **Formatting** | Prettier | Built-in | Code style consistency |
| **Package Manager** | pnpm | >=10.0.0 | Deterministic installs |

**Critical: ALL versions are pinned exactly (no `^`, `~`, or ranges).** See `dependency-pinning` rule.

## Architecture: Production-Grade Modular System

This template uses a **three-layer modular architecture** designed for scalability, team collaboration, and shipping fast without sacrificing quality.

### Core Principles

1. **Module Autonomy** — Each feature module is self-contained and independently deployable
2. **Strict Layering** — Clear separation enforced by ESLint, preventing accidental coupling
3. **Service Abstraction** — All native APIs hidden behind service layers for testability
4. **Type Safety** — TypeScript strict mode, no `any`, discriminated unions at boundaries
5. **Minimal Comments** — Self-documenting code through intent-revealing names

### Layering Model

```
┌──────────────────────────────────────────────────────────┐
│ app/                                                      │
│ - Root entry (app.tsx) & providers (I18n, Theme, Nav)   │
│ - Navigation (RootNavigator, AuthNavigator, AppNav)     │
│ - App-level screens (vault for saved sessions, etc.)    │
└────────────────────┬─────────────────────────────────────┘
                     │ imports from modules/
┌────────────────────▼─────────────────────────────────────┐
│ modules/[feature-name]/        (Self-contained units)    │
│                                                          │
│  ├─ app/                      (UI entry point)           │
│  │  ├─ [Feature]Flow.tsx      (Multi-step flow)          │
│  │  └─ components/            (Feature-scoped UI)        │
│  │                                                        │
│  ├─ features/step-X/          (Individual steps)         │
│  │  ├─ Step[X].tsx            (Step logic + UI)          │
│  │  └─ components/            (Step-specific components) │
│  │                                                        │
│  └─ shared/                   (Module-scoped reusables)  │
│     ├─ constants/             (Config, accent color)     │
│     ├─ store/                 (Zustand session store)    │
│     ├─ types/                 (Module interfaces)        │
│     ├─ utils/                 (Logic helpers)            │
│     ├─ hooks/                 (Module-scoped hooks)      │
│     └─ index.ts               (Barrel export)            │
└────────────────────┬─────────────────────────────────────┘
                     │ imports from shared/
┌────────────────────▼─────────────────────────────────────┐
│ shared/                    (Global layer - no deps)      │
│                                                          │
│  ├─ assets/               (Icons, images, fonts)         │
│  ├─ config/               (App-wide configuration)       │
│  ├─ constants/            (Global keys, limits, etc.)    │
│  ├─ hooks/                (Shared custom hooks)          │
│  ├─ i18n/                 (Spanish/English translations) │
│  ├─ lib/                  (API client, error handling)   │
│  ├─ services/             (Storage, logger, etc.)        │
│  ├─ stores/               (Global Zustand stores)        │
│  ├─ theme/                (Colors, spacing, typography)  │
│  ├─ types/                (Global TypeScript defs)       │
│  ├─ ui/                   (Reusable components)          │
│  └─ utils/                (Global utility functions)     │
└──────────────────────────────────────────────────────────┘
```

### Dependency Rules (ESLint-Enforced)

| Source | Can Import From | Cannot Import From |
|--------|-----------------|-------------------|
| **app/** | `app/`, `modules/`, `shared/` | *(none)* |
| **modules/[name]/** | Same module, `shared/` | `app/`, other modules |
| **shared/** | `shared/` ONLY | `app/`, `modules/` |

**Why this matters:**
- Modules can't import siblings → no hidden dependencies
- Shared can't import modules → clear abstraction boundary
- app imports everything → orchestration layer only

Native packages (AsyncStorage, camera, sensors) ONLY accessed via `shared/services/*`.

Path aliases: `@app/*`, `@modules/*`, `@shared/*`, `@test/*`

See `.claude/rules/mobile-architecture.md` for full details.

## 13 Non-Negotiable Rules

### Architecture & Tooling
1. **mobile-architecture** — Strict layering, imports enforced by ESLint
2. **pnpm-only** — ONLY pnpm; npm/yarn blocked at preinstall hook
3. **dependency-pinning** — Exact versions (no `^`, `~`, or ranges)

### Code Standards
4. **screaming-code** — Names declare intent (no abbreviations, no `data`/`item`)
5. **typescript-no-any** — Prohibit `any`; use `unknown` + type guards
6. **theme-tokens-only** — NO hardcoded colors/sizes; use `@shared/theme`
7. **i18n-required** — ALL user-visible strings via `t()`, keys in es.json + en.json
8. **code-comments** — Minimal (2-3 max, 5 only exceptional), English only, explain WHY

### Data & Logic
9. **service-layer** — Native APIs ONLY in `shared/services/`; everything else consumes them
10. **database-sqlite** — SQLite with migrations, parametrized queries, transactions
11. **error-handling** — Typed `AppError` with codes, i18n in UI, console logging with context
12. **testing-required** — Unit tests for stores/services/utils; component tests for UI
13. **team-conventions** — English imperative commits, PR checklist, no force-push main

**All 13 rules are in `.claude/rules/` — read them, live them, enforce them.**

## Project Layout Details

### app/ — Application Composition Layer

```
app/
├── app.tsx                      # Root: renders AppProviders → RootNavigator
├── constants/                   # App-level constants (storage keys, etc.)
├── navigation/
│   ├── RootNavigator.tsx       # Dispatcher: auth check → AuthNavigator or AppNavigator
│   ├── AuthNavigator.tsx       # Unauthenticated flow (login, register)
│   └── AppNavigator.tsx        # Authenticated flow (bottom tabs → modules)
├── providers/
│   └── AppProviders.tsx        # Wraps: I18nProvider, ThemeProvider, NavigationContainer, Zustand hydration
└── screens/
    ├── auth/
    │   ├── LoginScreen.tsx
    │   └── RegisterScreen.tsx
    └── vault/
        └── VaultScreen.tsx     # (optional) Saved sessions history
```

**Responsibilities:**
- Root entry point & provider setup
- Navigation orchestration (who can see what)
- App-level screens (auth flows, vault)
- No business logic, no direct native API calls

### modules/[feature-name]/ — Feature Modules

Each module is **completely self-contained** and represents one user-facing feature. Think of each as a mini-app.

```
modules/todos-module/           (Example: TODO management)
├── app/
│   ├── index.tsx               # Exports default: TodosFlow
│   ├── TodosFlow.tsx           # Multi-step flow orchestrator
│   └── components/             # Feature-scoped UI (not shared)
│
├── features/                   # Individual steps of the flow
│   ├── step-list/
│   │   ├── index.ts
│   │   ├── StepList.tsx        # Main TODO list
│   │   └── components/
│   │       ├── TodoItem.tsx
│   │       └── TodoList.tsx
│   ├── step-add/
│   │   ├── index.ts
│   │   └── StepAdd.tsx         # Add new TODO form
│   └── step-summary/
│       ├── index.ts
│       └── StepSummary.tsx     # Stats & progress view
│
├── shared/                     # Module-scoped reusables
│   ├── constants/
│   │   ├── todosModuleConfig.ts   # id, name, version, icon
│   │   └── todosPaletteColors.ts  # Module accent colors (hex allowed)
│   ├── store/
│   │   ├── index.ts
│   │   └── useTodosSessionStore.ts # Zustand: todos[], currentStep, filters
│   ├── types/
│   │   ├── todos.types.ts         # Todo, TodoFilter, TodoStats interfaces
│   │   └── index.ts
│   ├── utils/
│   │   ├── validateTodo.ts        # Input validation
│   │   └── filterTodos.ts         # Business logic
│   ├── hooks/
│   │   └── useTodoStats.ts        # useMemo: calculate stats
│   └── index.ts                # Barrel: export public API
│
└── index.ts                    # Module export (for AppNavigator tabs)
```

**Module Public API:**
```typescript
// modules/todos-module/index.ts
export { default as TodosModule } from './app';
export type { Todo, TodoFilter } from './shared/types';
export { useTodosSessionStore } from './shared/store';
```

**Importing a Module:**
```typescript
// In AppNavigator
import { TodosModule } from '@modules/todos-module';

<Tab.Screen
  name="Todos"
  component={TodosModule.default}
  options={{ title: t('todos.tabTitle') }}
/>
```

**Key Rules:**
- ✅ Modules CAN import from `shared/`
- ✅ Module can use its own `shared/`
- ❌ Module CANNOT import from `app/`
- ❌ Module CANNOT import from another module
- ❌ No direct native API imports (use `shared/services`)

### shared/ — Global Layer (No Dependencies)

This layer contains ONLY reusable code. **It can only import from itself.** No circular dependencies possible.

```
shared/
├── assets/                   # Static assets
│   ├── animations/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── config/                   # App-wide configuration
│   ├── appConfig.ts         # Feature flags, timeouts, thresholds
│   └── index.ts
│
├── constants/                # Global keys & constants
│   ├── storageKeys.ts       # All persistence keys (rnstarter_*)
│   ├── errorCodes.ts        # Error code enum
│   ├── limits.ts            # Max retries, timeouts, sizes
│   ├── regex.ts             # Common regex patterns
│   └── index.ts
│
├── hooks/                    # Shared custom hooks
│   ├── useAsyncOperation.ts # Loading + error handling
│   ├── useDebouncedCallback.ts
│   ├── useResponsive.ts     # Screen size detection
│   └── index.ts
│
├── i18n/                     # Internationalization
│   ├── es.json              # Spanish (primary)
│   ├── en.json              # English (mirror)
│   ├── i18n.ts              # i18n-js setup
│   ├── I18nProvider.tsx     # Provider component
│   ├── useTranslation.ts    # useTranslation hook
│   └── index.ts
│
├── lib/                      # Core libraries (api, errors)
│   ├── api/
│   │   ├── api.ts           # Fetch wrapper
│   │   ├── api.config.ts    # Endpoints, headers
│   │   ├── api.types.ts     # Types
│   │   └── index.ts
│   ├── errors/
│   │   ├── AppError.ts      # Typed error class
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   └── index.ts
│
├── services/                 # Native API wrappers
│   ├── index.ts             # ServiceContainer
│   ├── storage/             # AsyncStorage wrapper
│   ├── database/            # SQLite wrapper
│   ├── logger/              # Logging service
│   ├── camera/              # (example) Camera wrapper
│   ├── location/            # (example) Location wrapper
│   └── [other]/
│
├── stores/                   # Global Zustand stores
│   ├── useAuthStore.ts      # Auth + user state
│   ├── zustandStorageAdapter.ts # AsyncStorage bridge
│   └── index.ts
│
├── theme/                    # Design tokens
│   ├── colors.ts            # Semantic colors (light/dark)
│   ├── typography.ts        # Font sizes, weights, presets
│   ├── spacing.ts           # Padding/margin scale
│   ├── radii.ts             # Border radius tokens
│   ├── layout.ts            # Screen padding, max-width
│   ├── ThemeContext.tsx     # Dark/light mode
│   └── index.ts
│
├── types/                    # Global TypeScript defs
│   ├── user.types.ts
│   ├── common.types.ts
│   ├── api.types.ts
│   └── index.ts
│
├── ui/                       # Reusable UI components
│   ├── AppAlert/
│   ├── AppButton/           # Primary, secondary, danger
│   ├── AppCard/             # Modern card
│   ├── AppInput/            # Text input
│   ├── AppScreen/           # Screen wrapper
│   ├── AppText/             # Text with presets
│   ├── HeaderModule/
│   ├── icons/
│   └── index.ts
│
└── utils/                    # Utility functions
    ├── validation.ts        # Email, password validation
    ├── dateFormat.ts        # Date formatting
    ├── deviceId.ts          # Device ID
    ├── idGenerator.ts       # UUID, random IDs
    └── index.ts
```

**Rule:** Every file here must be safe to import from anywhere. **No circular dependencies, no native APIs.**

### test/ — All Test Suites

```
test/
├── unit/
│   ├── stores/              # Zustand store tests
│   ├── services/            # Service class tests
│   └── utils/               # Utility function tests
├── components/              # Component & screen rendering tests
├── mocks/
│   ├── async-storage.mock.ts
│   ├── expo-vector-icons.mock.ts
│   ├── react-navigation-native.mock.ts
│   ├── react-native.mock.ts
│   ├── react-native-safe-area-context.mock.ts
│   └── services/            # Service mocks for testing
├── setup.ts                 # Jest configuration & globals
└── utils/
    └── renderWithProviders.tsx # Test helper (I18n, Zustand, Theme)

# Note: e2e/ (End-to-end tests with Detox) planned for future
```

## Data Flow & Patterns

### Authentication Flow
```
1. LoginScreen (app/screens)
   └─ calls → useAuthStore.login(username, password)
      └─ (Zustand action)
         ├─ validates credentials
         ├─ calls → services.secureStorage.set(token)
         └─ sets → { user, isAuthenticated: true }

2. AppProviders (app/providers)
   └─ useEffect on mount
      └─ calls → useAuthStore.getState().rehydrate()
         └─ re-hydrates from AsyncStorage (skipHydration: true)

3. RootNavigator (app/navigation)
   └─ reads → isAuthenticated
      └─ conditionally renders AuthNavigator or AppNavigator
```

### Error Handling Flow
```
Service Layer:
  try { ... }
  catch (error) {
    throw new AppError(ErrorCodes.NETWORK_ERROR, 'message', status, details)
  }
         ↓
Store Layer (Zustand):
  catch (error) {
    const code = error instanceof AppError ? error.code : UNKNOWN_ERROR
    set({ errorCode: code, isLoading: false })
  }
         ↓
UI Layer (Component):
  const errorCode = useAuthStore(state => state.errorCode)
  useEffect(() => {
    if (errorCode) {
      const msg = t(`errors.${errorCode}`)  // Translate
      showErrorToast(msg)                   // Display
      setTimeout(() => clearError(), 5000)  // Auto-dismiss
    }
  })
```

### Module Lifecycle
```
1. ModuleBootstrap (app/modules)
   └─ reads manifest or registry
      └─ lazy loads → modules/[module-name]/index.ts
         └─ exports → ModuleDefinition { id, component, init, ... }

2. Module.init() (on app launch or module enable)
   └─ can set up DB tables, caches, listeners

3. HomeScreen → renders → list of enabled modules
   └─ tap module → ModuleRunnerScreen
      └─ renders → module.component (as child navigator or full screen)

4. Module.destroy() (on app shutdown or module disable)
   └─ cleanup: unsubscribe listeners, close DB, etc.
```

## Development Workflow

### Before Any Commit

From repository root:

```bash
pnpm exec tsc --noEmit     # TypeScript: 0 errors
pnpm run lint              # ESLint: 0 warnings (includes boundary checks)
pnpm test                  # Jest: all tests pass
pnpm audit                 # pnpm: no critical vulnerabilities
```

If any fail, fix first, then commit.

### Scripts Available

```bash
pnpm start              # Metro dev server (press a, i, w)
pnpm run lint           # ESLint check + auto-fix
pnpm exec tsc --noEmit  # Type check (no emit)
pnpm test               # Jest (watch mode available)
pnpm test --coverage    # Coverage report

pnpm android            # Run on Android device/emulator
pnpm ios                # Run on iOS simulator/device
pnpm web                # Run on web (dev server)

pnpm audit              # Check dependencies for CVEs
pnpm audit --fix        # Auto-fix known vulnerabilities
```

## Creating New Applications

### Step 1: Clone Template

```bash
git clone <this-repo> my-app-name
cd my-app-name
rm -rf .git && git init
```

### Step 2: Rename Project

Update 3 files in repository root:

**app.json:**
```json
{
  "name": "My App Name",
  "slug": "my-app-name",
  "scheme": "myappname",
  "android": { "package": "com.yourcompany.myappname" }
}
```

**package.json:**
```json
{
  "name": "my-app-name"
}
```

**shared/constants/storageKeys.ts:**
```typescript
export const STORAGE_KEYS = {
  userSession: 'myappname_user_session',
  locale: 'myappname_locale',
} as const;
```

### Step 3: Initialize & Validate

```bash
pnpm install
pnpm exec tsc --noEmit  # Should pass
pnpm run lint           # Should pass
pnpm test               # Should pass
```

### Step 4: Start Development

```bash
pnpm start
# Press 'a' for Android or 'i' for iOS
```

### Step 5: Create First Feature Module

Follow `modules/example-module/` structure when creating new modules. The template module demonstrates all required patterns: screens, navigation, domain logic (features/), types, hooks, and services layering.

## Naming Conventions

| Type | Format | Example | Location |
|------|--------|---------|----------|
| Components | `PascalCase` | `LoginButton.tsx` | `app/screens/`, `modules/*/app/`, `shared/ui/` |
| Hooks | `camelCase` + use | `useAuthStore.ts` | `shared/hooks/`, `modules/*/shared/hooks/` |
| Stores | `camelCase` + Store | `useAuthStore.ts` | `shared/stores/` |
| Services | `PascalCase` + Service | `StorageService.ts` | `shared/services/`, `modules/*/shared/services/` |
| Types | `camelCase.types.ts` | `user.types.ts` | `shared/types/`, `modules/*/shared/types/` |
| Constants | `camelCase` | `storageKeys.ts` | `shared/constants/`, `modules/*/shared/constants/` |
| Modules | `kebab-case` | `auth-module` | `modules/` |
| Folders | `lowercase` | `screens/`, `shared/` | N/A |
| Variables | `camelCase` | `userName`, `isLoading` | Scope: local, global |
| Constants (inline) | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES`, `API_TIMEOUT` | Module-level |
| Booleans | is/has/can prefix | `isAuthenticated`, `hasError` | Predicates |
| Functions | verb + camelCase | `getUser()`, `formatDate()` | Exported functions |
| Error codes | `UPPER_CASE` | `INVALID_CREDENTIALS` | Error enum |
| i18n keys | `area.screen.element` | `auth.login.usernameLabel` | JSON files |

## Internationalization (i18n)

### Adding a New String

1. Decide key following pattern: `area.screen.element` (e.g., `auth.login.submitButton`)
2. Add to `shared/i18n/es.json`:
   ```json
   "auth.login.submitButton": "Entrar"
   ```
3. Add to `shared/i18n/en.json`:
   ```json
   "auth.login.submitButton": "Login"
   ```
4. Use in component:
   ```typescript
   import { useTranslation } from '@shared/i18n';
   
   export function LoginScreen() {
     const t = useTranslation();
     return <Button title={t('auth.login.submitButton')} />;
   }
   ```

**Key Requirement:** BOTH `es.json` and `en.json` must have identical keys. Missing keys are caught at linting time (no `defaultValue` fallbacks).

## Storage & Persistence

### AsyncStorage (Session, Preferences)
```typescript
// Via service layer
import { services } from '@shared/services';

await services.storage.set('mykey', { data: 'value' });
const data = await services.storage.get('mykey');
```

### SecureStore (Tokens, Passwords)
```typescript
// Never in AsyncStorage — use SecureStore
import { services } from '@shared/services';

await services.secureStorage.set('authToken', token);
const token = await services.secureStorage.get('authToken');
```

### SQLite (Structured Data)
```typescript
// Via DatabaseService
import { services } from '@shared/services';

const users = await services.database.query(
  'SELECT * FROM users WHERE role = ?',
  ['admin']
);

await services.database.transaction(async (db) => {
  await db.execute('INSERT INTO users (...) VALUES (...)', [...]);
  await db.execute('UPDATE users SET ... WHERE ...');
});
```

## Testing Strategy

### Unit Tests (stores, services, utils)
```typescript
// test/unit/stores/useAuthStore.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { useAuthStore } from '@shared/stores/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => useAuthStore.getState().logout());

  it('should authenticate with valid credentials', async () => {
    await useAuthStore.getState().login('admin', '1234');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
```

### Component Tests (screens, UI components)
```typescript
// test/components/LoginScreen.test.tsx
import { describe, it, expect } from '@jest/globals';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { LoginScreen } from '@app/screens/LoginScreen';

describe('LoginScreen', () => {
  it('should render login form', () => {
    renderWithProviders(<LoginScreen />);
    expect(screen.getByPlaceholderText('email')).toBeTruthy();
  });
});
```

## Demo Application

The template includes a working demo:

- **Login Credentials:** username `admin`, password `1234`
- **Flow:** LoginScreen → HomeScreen → ModuleRunnerScreen (example-module)
- **Example Module:** Located at `modules/example-module/`

Demo serves as reference for module structure and navigation patterns. Replace with your actual features.

## Native Code (Android & iOS)

The template uses Expo CLI without prebuild by default. To add native code:

```bash
npx expo prebuild
```

This generates `android/` and `ios/` directories. Once created, commit them to git (`.gitignore` preserves source, excludes build artifacts like `build/`, `.gradle/`, `Pods/`, `local.properties`).

For development without native modifications, use Expo Go app.

## Key Decisions & Rationale

| Decision | Reason |
|----------|--------|
| Exact version pinning (no `^`, `~`) | Reproducible installs across all envs (dev, CI, prod) |
| pnpm only | Deterministic, monorepo-ready, shared dependency store |
| Zustand over Context | Simpler API, no provider hell, built-in persistence |
| Service layer | Testable native APIs, single source of truth for platform concerns |
| SQLite over AsyncStorage | Structured queries, transactions, indexes (for complex data) |
| Three-layer architecture | Separation of concerns, independent module delivery, bounded coupling |
| i18n-js over react-i18next | Lighter weight, works with server-side rendering patterns |
| ESLint boundaries | Enforce layering automatically, prevent implicit coupling |
| TypeScript strict | Catch bugs at compile time, safer refactors |
| Minimal comments | Self-documenting code names, explain WHY not WHAT |

## Getting Help

- **Architecture questions:** Read `.claude/rules/mobile-architecture.md`
- **Code standards:** Review `.claude/rules/` folder (13 rules)
- **Example code:** Inspect `modules/example-module/`
- **Type patterns:** Check `shared/types/` for discriminated unions and generics
- **Decisions & rationale:** See `HANDOFF.md` for architectural context

## Quick Reference

| Task | Command | File |
|------|---------|------|
| Run tests | `pnpm test` | `jest.config.js` |
| Add i18n key | Edit both `.json` files | `shared/i18n/` |
| Create module | Follow `example-module` structure | `modules/` |
| New store | Create in `shared/stores/` | `shared/stores/` |
| New service | Create in `shared/services/` | `shared/services/` |
| Theme token | Use from `@shared/theme` | `shared/theme/` |
| Type definition | Add to appropriate `.types.ts` | `shared/types/` |
| Unit test | Mirror source path in `test/unit/` | `test/unit/` |

**Last updated:** 2026-08-09
