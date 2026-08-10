# Dependency Pinning — Exact Versions Only

All dependencies in `package.json` must use **exact versions** (no `^`, `~`, `>=`, or ranges).

## Rule

Every entry in `dependencies` and `devDependencies` must be an exact version:

```json
{
 "dependencies": {
 "react": "19.2.0", // CORRECT: Exact
 "zustand": "5.0.11", // CORRECT: Exact
 "@react-navigation/native": "7.1.33" // CORRECT: Exact
 },
 "devDependencies": {
 "typescript": "5.9.2", // CORRECT: Exact
 "eslint": "9.25.0" // CORRECT: Exact
 }
}
```

## Prohibited Patterns

| Pattern | Why | Fix |
|---------|-----|-----|
| `"react": "^19.2.0"` | Version range, unpredictable | `"react": "19.2.0"` |
| `"expo": "~55.0.0"` | Allows patch updates | `"expo": "55.0.26"` |
| `"zustand": ">=5.0.0"` | Unbounded upper limit | `"zustand": "5.0.11"` |
| `"@types/react": "*"` | Any version | `"@types/react": "19.2.10"` |

## pnpm.overrides for Transitive Conflicts

When a transitive dependency has a vulnerability or compatibility issue, pin it in `pnpm.overrides`:

```json
{
 "pnpm": {
 "overrides": {
 "handlebars": ">=4.7.9", // Prototype Pollution CVE
 "uuid": ">=11.1.1", // CSPRNG issue
 "js-yaml": ">=4.2.0", // DoS vulnerability
 "@eslint/plugin-kit": ">=0.3.4" // ESLint 9 compat
 }
 }
}
```

## Audit & Validation

Before committing:

```bash
cd mobile
pnpm audit --audit-level=moderate # Check for vulnerabilities
pnpm audit fix --force # Auto-fix known issues
```

Expect output:
```
CORRECT: 0 critical
CORRECT: 0 high
CORRECT: 0 moderate
```

## Why

- **Reproducibility**: Exact versions guarantee identical installs across all machines
- **Security**: GitHub does not report "version compatibility" warnings when versions are exact and audited
- **Debugging**: No surprise breakage from minor/patch versions
- **CI/CD**: Consistent behavior across environments (dev, staging, prod)
- **Supply chain**: Easier to audit and lock known-good versions

## Adding New Dependency

```bash
pnpm add package-name
```

Then manually edit `package.json` to remove any `^` or `~`:

```json
// After pnpm add lodash
// Initially added as:
"lodash": "^4.17.21"

// Change to:
"lodash": "4.17.21"
```

## Testing Exact Versions

```bash
# Install from lock file (should always succeed)
pnpm install --frozen-lockfile

# Simulate CI environment
pnpm install --prod
```

## Violation Detection

ESLint can check this with a custom rule (future enhancement):
```bash
pnpm run lint:versions
```

For now, review manually or via CI check.
