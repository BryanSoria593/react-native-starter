# TypeScript — No `any`

Strict mode is on. `any` defeats the type system and is not allowed.

## Rule

- Prohibited: `any`, `as any`, `@ts-ignore`, `@ts-expect-error` (without a justified comment).
- At system boundaries (parsing JSON, storage reads), type as `unknown` and narrow with a type guard.
- ESLint: `@typescript-eslint/no-explicit-any` is `warn` project-wide and `error` in `mobile/modules/**`.

## Pattern — narrowing `unknown`

```ts
function isUser(value: unknown): value is User {
 return (
 typeof value === 'object' &&
 value !== null &&
 'id' in value &&
 'username' in value
 );
}
```

## Why

`strict` + no `any` catches whole classes of bugs at compile time and keeps refactors safe. Run
`pnpm exec tsc --noEmit` (from `mobile/`) before committing.
