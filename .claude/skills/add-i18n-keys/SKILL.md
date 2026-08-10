---
name: add-i18n-keys
description: Use when adding new UI strings to this project, when a t() call has no matching key, or when only one language file was updated and the other is missing the key.
---

# add-i18n-keys

This project has two i18n files that must always stay in sync. Keys are in English; the Spanish
value is user-facing (primary locale). A missing key surfaces as a broken string — there are no
`defaultValue` fallbacks (enforced by ESLint).

## Rules (non-negotiable)

1. **Both files, always** — `mobile/shared/i18n/es.json` AND `mobile/shared/i18n/en.json` must have the key.
2. **English keys** — `auth.login.usernameLabel`, never `auth.login.etiquetaUsuario`.
3. **Spanish values in es.json** — the user reads Spanish (primary locale).
4. **English values in en.json** — parallel translation, identical key structure.
5. **No `defaultValue`** — `t('key')` only; a missing key must surface, not be silently masked.
6. **Interpolation** uses i18n-js syntax: `"welcome": "Bienvenido, %{username}"` → `t('home.welcome', { username })`.

## Key naming convention

```
[area].[screenOrStep].[element]

auth.login.submitButton
home.modulesTitle
<moduleId>.displayName
<moduleId>.step<Name>.title
```

## Adding keys — the pattern

**Step 1** — Add the block to BOTH files (same keys, different values):
```json
// es.json
"<area>": { "title": "Título", "submitButton": "Continuar" }
```
```json
// en.json
"<area>": { "title": "Title", "submitButton": "Continue" }
```

**Step 2** — Use it in code:
```tsx
const { t } = useTranslation();   // from @shared/i18n
<AppText>{t('<area>.title')}</AppText>
```

**Step 3** — Verify both files have the key (run from `mobile/`):
```bash
node -e "
  const es = require('./shared/i18n/es.json');
  const en = require('./shared/i18n/en.json');
  const key = '<area>.title';
  const get = (o, k) => k.split('.').reduce((a, p) => a?.[p], o);
  console.log('es:', get(es, key), '| en:', get(en, key));
"
```

## Common mistakes

| Mistake | Fix |
|---|---|
| Adding key to es.json but not en.json | Always edit both files in the same change |
| Spanish key names (`modulo.paso`) | Keys are English identifiers, always |
| `t('key', { defaultValue: '...' })` | Remove `defaultValue` — add the real key instead |
| Values in es.json written in English | es.json values are Spanish — it is the primary locale |
| Forgetting interpolation vars | Use `%{var}` in the value and pass `{ var }` to `t()` |
