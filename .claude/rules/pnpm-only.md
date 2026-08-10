# pnpm Only — Consistency and Lock File Integrity

Never use `npm` or `yarn`. Always use `pnpm` for dependency management.

## Rule

- All installations must use `pnpm install` (never `npm install` or `yarn install`)
- All scripts run via `pnpm run <script>` (never `npm run` or `yarn`)
- Package manager is enforced at the git hook level

## Enforcement

**package.json** includes:
```json
{
 "engines": {
 "npm": "please-use-pnpm",
 "yarn": "please-use-pnpm",
 "pnpm": ">=10.0.0"
 },
 "scripts": {
 "preinstall": "npx only-allow pnpm"
 }
}
```

**.npmrc** includes:
```ini
engine-strict=true
engine-check-pnpm-version=true
```

## Why

- **Reproducibility**: `pnpm-lock.yaml` ensures exact versions across all machines
- **Disk efficiency**: Monorepo-friendly, shared dependency store
- **Deterministic installs**: No version range ambiguity
- **Workspace support**: Native monorepo capabilities
- **Security**: Strict dependency resolution, no auto-elevation

## Example

```bash
CORRECT: pnpm install # Allowed
CORRECT: pnpm run lint # Allowed
CORRECT: pnpm test # Allowed

WRONG: npm install # Blocked by preinstall hook
WRONG: yarn install # Blocked by preinstall hook
WRONG: npm run lint # Blocked by preinstall hook
```

## Violation Detection

If someone runs `npm install`, they'll see:
```
ERR! FATAL: Refused to install with npm. Use pnpm instead.
ERR! See https://pnpm.io for help.
```
