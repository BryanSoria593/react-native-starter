# Skill: Create New Module

**Purpose**: Generate a complete, production-ready feature module with exact structure and boilerplate.

---

## Module Structure (REQUIRED)

Every module MUST follow this exact structure:

```
modules/[feature-name]/
├── app/
│   ├── index.tsx                  # export default [Feature]Flow
│   ├── [Feature]Flow.tsx          # Multi-step orchestrator
│   └── components/                # Feature UI (optional)
├── features/
│   ├── step-[name]/
│   │   ├── index.ts               # export { Step[Name] }
│   │   ├── Step[Name].tsx
│   │   └── components/            # Step UI (optional)
│   └── step-[other]/...
├── shared/
│   ├── constants/
│   │   ├── [featureName]ModuleConfig.ts
│   │   └── [featureName]PaletteColors.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── use[Feature]SessionStore.ts
│   ├── types/
│   │   ├── [featureName].types.ts
│   │   └── index.ts
│   ├── utils/
│   │   └── validate[Feature].ts
│   ├── hooks/
│   │   └── use[Feature]Stats.ts
│   └── index.ts                   # Barrel export
└── index.ts                       # Root export
```

---

## File Templates

### 1. Module Config

```typescript
// modules/[feature-name]/shared/constants/[featureName]ModuleConfig.ts
export const [FEATURE]_MODULE_CONFIG = {
  id: '[feature-name]-module',
  name: '[Feature Name]',
  version: '1.0.0',
  icon: '[icon-name]',
  description: '[User description]',
} as const;
```

### 2. Types

```typescript
// modules/[feature-name]/shared/types/[featureName].types.ts
export interface [Feature]State {
  isLoading: boolean;
  errorCode: string | null;
  currentStep: 'step-1' | 'step-2';
}
```

### 3. Store

```typescript
// modules/[feature-name]/shared/store/use[Feature]SessionStore.ts
import { create } from 'zustand';
import type { [Feature]State } from '../types';

interface [Feature]Actions {
  navigateToStep: (step: string) => void;
}

export const use[Feature]SessionStore = create<[Feature]State & [Feature]Actions>((set) => ({
  isLoading: false,
  errorCode: null,
  currentStep: 'step-1',
  navigateToStep: (step) => set({ currentStep: step as any }),
}));
```

### 4. Flow

```typescript
// modules/[feature-name]/app/[Feature]Flow.tsx
import { use[Feature]SessionStore } from '../shared/store';
import { Step[Name] } from '../features/step-[name]';

export function [Feature]Flow() {
  const { currentStep, navigateToStep } = use[Feature]SessionStore();
  
  return (
    <AppScreen>
      {currentStep === 'step-1' && <Step[Name] onNext={() => navigateToStep('step-2')} />}
    </AppScreen>
  );
}
```

### 5. Step

```typescript
// modules/[feature-name]/features/step-[name]/Step[Name].tsx
export function Step[Name]({ onNext }: { onNext: () => void }) {
  return (
    <View>
      <AppText preset="h1">Step Name</AppText>
      <AppButton title="Next" onPress={onNext} />
    </View>
  );
}
```

---

## Integration

1. Add to `app/navigation/AppNavigator.tsx`:

```typescript
import { [Feature]Module } from '@modules/[feature-name]-module';

<Tab.Screen
  name="[Feature]"
  component={[Feature]Module}
  options={{
    title: t('[featureName].tabTitle'),
    tabBarIcon: ({ color, size }) => <Ionicons name="[icon]" size={size} color={color} />,
  }}
/>
```

2. Add i18n keys to `shared/i18n/es.json` and `en.json`:

```json
{
  "[featureName].tabTitle": "[Feature Name]"
}
```

3. Validate:

```bash
pnpm exec tsc --noEmit && pnpm run lint && pnpm test
```

---

## Checklist

- ✅ Structure created (folder tree)
- ✅ Config file with id, name, icon
- ✅ Types file with [Feature]State
- ✅ Store with navigateToStep action
- ✅ Flow component (orchestrates steps)
- ✅ At least 1 Step component
- ✅ All index.ts barrel exports
- ✅ Added to AppNavigator
- ✅ i18n keys in both JSON files
- ✅ Types compile, lint passes

---

## Examples

- `modules/todos-module/` - Complete multi-step feature
- `modules/auth-module/` - Login/register flow

