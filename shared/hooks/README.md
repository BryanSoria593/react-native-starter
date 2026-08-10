# shared/hooks

Reusable, cross-cutting React hooks that are not tied to a single screen or module.

Place hooks here that any part of the app (or any module) may consume via `@shared/hooks`.
Keep module-specific hooks inside that module's own `shared/hooks/` folder instead.

Naming: `useSomething.ts` (camelCase, `use` prefix). Add a barrel `index.ts` when the first hook lands.
