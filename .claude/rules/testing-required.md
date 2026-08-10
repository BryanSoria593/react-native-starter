# Testing Required

Pure logic — stores, services, registries, and utilities — has unit tests.
UI components and screens have component tests.

## Rule

Add **unit tests** under `mobile/test/unit/` mirroring the source path:

- Zustand stores → `mobile/test/unit/stores/`
- Services → `mobile/test/unit/services/`
- Registries / utilities → `mobile/test/unit/modules/`, `mobile/test/unit/utils/`

Add **component tests** under `mobile/test/components/` mirroring the source path
(`shared/ui/`, `app/`, `modules/`), rendering with the `renderWithProviders` helper from
`@test/utils/renderWithProviders`.

## Test file boilerplate (always import globals from `@jest/globals`)

Every test file imports the Jest globals it uses from `@jest/globals` — never rely on ambient
globals (the editor's TS server does not resolve them and reports `Cannot find name 'describe'`).

```ts
// unit test
import { describe, it, expect, beforeEach } from '@jest/globals';

// component test
import React from 'react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithProviders } from '@test/utils/renderWithProviders';
```

Standards:
- Import every Jest global used (`describe`, `it`, `expect`, `jest`, `beforeEach`, …) from `@jest/globals`.
- No `as any` in tests; type helpers properly (use `Partial<T>` for fixtures).
- Reset shared state in `beforeEach` (`logout()`, `clearModuleRegistry()`).
- Assert locale-exact strings where translations are involved.
- A disabled control is verified via its `props.disabled`, not by asserting a handler was not called
 (RTL `fireEvent.press` bubbles to the component's own `onPress` prop).

## Running

```bash
cd mobile
pnpm test
```

## Why

Tests on the deterministic core (auth, storage, module discovery) catch regressions without the
flakiness of full UI rendering, and they document the intended behavior.
