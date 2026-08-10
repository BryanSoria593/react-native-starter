# i18n Required — All UI Strings Through t()

No user-visible string is hardcoded in a component. Every string has a key in both `es.json` and
`en.json`.

## Rule

- Use `t('key')` from `useTranslation()` for every string rendered to the user.
- Keys are in English (e.g., `auth.login.usernameLabel`); values stay in Spanish (primary locale).
- Both `mobile/shared/i18n/es.json` and `mobile/shared/i18n/en.json` must contain the key.
- No `defaultValue` fallbacks: a missing key is a bug, not graceful degradation (enforced by ESLint).

## Prohibited

| Pattern | Why | Correct |
|---|---|---|
| `<Text>Entrar</Text>` | Hardcoded string | `<AppText>{t('auth.login.submitButton')}</AppText>` |
| `title="Cerrar"` | Hardcoded in prop | `title={t('common.back')}` |
| `t('x', { defaultValue: 'X' })` | Masks missing key | Add the key to both JSON files |

## Key Naming Convention

```
[area].[screenOrStep].[element]

auth.login.usernameLabel
home.modulesTitle
exampleModule.greeting
```

## What Stays in Spanish (not a UI key)

- Module IDs in `mobile/app/modules/moduleBootstrap.ts` (code identifiers).
- Interpolation variables use i18n-js syntax: `"welcome": "Bienvenido, %{username}"`.
