# Service Layer — No Direct Native Imports in modules/ or app/

Native APIs (storage, camera, location, BLE, file system, etc.) are accessed only through `services.*`.

## Rule

In `mobile/modules/` and `mobile/app/`, never import native packages directly. Always go through the
service container at `mobile/shared/services/`.

## Prohibited Imports in modules/ or app/

```ts
// NEVER in mobile/modules/** or mobile/app/**:
import AsyncStorage from '@react-native-async-storage/async-storage';
// (and the same for expo-camera, expo-location, react-native-ble-plx, expo-file-system, …)

// ALWAYS:
import { services } from '@shared/services';
await services.storage.set(STORAGE_KEYS.userSession, value);
```

## Allowed Locations for Direct Imports

- `mobile/shared/services/**` — the service implementations that wrap the native package
- `mobile/test/mocks/**` — test mocks that simulate native behavior

## Why

The ESLint rule enforces this at lint time. Violating it in a feature module breaks:

- **Testability** — service mocks cannot intercept direct imports
- **Platform abstraction** — swapping a native package would require touching every module
- **Auditability** — no central point to add logging/error handling

## Adding a new service

Create `mobile/shared/services/<name>/<Name>Service.ts`, export it from
`mobile/shared/services/<name>/index.ts`, and add it as a property on the `services` object in
`mobile/shared/services/index.ts`.
