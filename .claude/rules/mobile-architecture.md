# Mobile Architecture — Layered Structure with Service Isolation

Strict three-layer architecture enforced by ESLint: `app/` → `modules/` → `shared/`.

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│ app/ │
│ - Navigation (RootNavigator, AuthNavigator) │
│ - Providers (I18n, Theme) │
│ - Top-level Screens │
│ - Module Registry & Bootstrapping │
└──────────────────┬──────────────────────────┘
 │ useModuleRegistry()
┌──────────────────▼──────────────────────────┐
│ modules/[feature-name]/ │
│ - Screens & Components (feature-specific) │
│ - Domain Logic (features/) │
│ - Module-scoped Services & Hooks │
└──────────────────┬──────────────────────────┘
 │ useAuthStore, services
┌──────────────────▼──────────────────────────┐
│ shared/ │
│ - Stores (Zustand) │
│ - Services (Storage, API, Database) │
│ - Global Types & Constants │
│ - Theme, i18n, UI Components │
└─────────────────────────────────────────────┘
```

## Import Rules (Enforced by ESLint)

### CORRECT: app/ can import from:
```typescript
import { SomeComponent } from '@app/screens'; // CORRECT: Same layer
import { SomeScreen } from '@app/navigation'; // CORRECT: Same layer
import { useAuthStore } from '@shared/stores'; // CORRECT: shared/
import { services } from '@shared/services'; // CORRECT: shared/
import { PaymentsModule } from '@modules/payments-module'; // CORRECT: modules/
```

### CORRECT: modules/ can import from:
```typescript
import { usePaymentState } from './features'; // CORRECT: Same module
import { services } from '@shared/services'; // CORRECT: shared/
import { User } from '@shared/types'; // CORRECT: shared/
import { useAuthStore } from '@shared/stores'; // CORRECT: shared/
```

### CORRECT: shared/ can ONLY import from:
```typescript
import { colors } from '@shared/theme'; // CORRECT: shared/
import type { User } from '@shared/types'; // CORRECT: shared/
import { STORAGE_KEYS } from '@shared/constants'; // CORRECT: shared/
```

### WRONG: Prohibited Imports

```typescript
// In app/ or modules/:
import AsyncStorage from '@react-native-async-storage/async-storage'; // WRONG: Direct native
import { View } from 'react-native'; // WRONG: Native import (use @shared/ui or wrapper)

// In modules/:
import { useAuthStore } from '@app/stores'; // WRONG: Can't import from app/
import { HomeScreen } from '@app/screens'; // WRONG: Can't import screens from app/

// In shared/:
import { PaymentsModule } from '@modules/payments-module'; // WRONG: Can't import from modules/
```

## Directory Structure

### app/ (Composition Layer)

```
app/
├── app.tsx # Root entry point
├── navigation/
│ ├── RootNavigator.tsx # Auth/App split
│ ├── AuthNavigator.tsx # Login flow
│ └── AppNavigator.tsx # Authenticated navigation
├── providers/
│ └── AppProviders.tsx # I18n, Theme, Navigation context
├── screens/
│ ├── HomeScreen.tsx # Module list & runner
│ └── ModuleRunnerScreen.tsx # Generic module container
└── modules/
 └── moduleRegistry.ts # Module registry & bootstrapping
```

### modules/ (Feature Layer)

```
modules/[feature-name]/
├── index.ts # Module export (ModuleDefinition)
├── app/
│ ├── index.tsx # Default export (component/entry)
│ ├── [FeatureName]Screen.tsx
│ └── components/
│ └── [ComponentName].tsx
├── features/
│ ├── [feature-name].ts # Domain logic (no UI)
│ └── [feature-name].test.ts
└── shared/
 ├── constants/
 │ ├── [moduleName]Keys.ts # Module constants
 │ └── [moduleName]Accent.ts # Module color (hex allowed here)
 ├── hooks/
 │ └── use[ModuleName]State.ts
 ├── services/
 │ └── [ModuleName]Service.ts
 ├── types/
 │ └── [moduleName].types.ts
 └── index.ts # Barrel export
```

### shared/ (Global Layer)

```
shared/
├── constants/
│ ├── storageKeys.ts # Global storage keys
│ └── apiConfig.ts # API endpoints, timeouts
├── hooks/
│ └── useFormValidation.ts
├── i18n/
│ ├── i18n.ts
│ ├── I18nProvider.tsx
│ ├── es.json # Spanish (complete, en/ mirror)
│ └── en.json # English (complete, es/ mirror)
├── services/
│ ├── storage/
│ │ ├── StorageService.ts
│ │ └── index.ts
│ ├── secureStorage/ # For tokens
│ ├── database/ # SQLite
│ ├── api/ # HTTP wrapper
│ └── index.ts # Service container
├── stores/
│ ├── useAuthStore.ts # Auth (persisted)
│ ├── zustandStorageAdapter.ts
│ └── [otherStore].ts
├── theme/
│ ├── colors.ts # Semantic colors
│ ├── typography.ts # Font sizes, weights
│ ├── spacing.ts # Padding, margin values
│ ├── radii.ts # Border radius tokens
│ └── index.ts
├── types/
│ ├── user.types.ts
│ ├── api.types.ts
│ ├── navigation.types.ts
│ └── errors.types.ts
└── ui/
 ├── AppButton.tsx
 ├── AppText.tsx
 └── index.ts # Barrel export
```

## Key Principles

### 1. **Service Layer Isolation**
- Native APIs ONLY in `shared/services/`
- Everything else consumes `services.*`
- Enables testing without mocks (when not testing services themselves)

### 2. **Store Centralization**
- All global state in `shared/stores/`
- Modules have local feature state only
- Zustand with `persist` middleware for critical data

### 3. **Module Independence**
- Each module is self-contained within its scope
- Can be enabled/disabled at runtime via registry
- No cross-module imports (go through stores/services)

### 4. **Type Safety**
- Discriminated unions for API responses
- Type guards at system boundaries
- No `any` type

### 5. **Theme Tokens**
- ALL visual values from `@shared/theme`
- Only exception: module accent colors in `modules/*/shared/constants/`
- ESLint enforces this

## Enforcement

ESLint plugin `eslint-plugin-boundaries` validates:

```bash
pnpm run lint # Catches all layer violations
```

## Migration Guide (from legacy code)

If you have code that violates these rules:

```typescript
// WRONG: OLD (in a module)
import AsyncStorage from '@react-native-async-storage/async-storage';
const token = await AsyncStorage.getItem('token');

// CORRECT: NEW (in a module)
import { services } from '@shared/services';
const token = await services.storage.get('authToken');
```

## Testing the Architecture

```bash
# Type check
pnpm exec tsc --noEmit

# Lint (includes boundary checks)
pnpm run lint

# Unit tests (verify services/stores)
pnpm test
```
