# Code Comments — Minimal and Intent-Focused

Comments must be minimal, meaningful, and English-only. Write comments that explain WHY, not WHAT.

## Rule

- **Maximum 2-3 comments per file** (5 only in exceptional cases with justification)
- **Never comment obvious code** (the code IS the comment)
- **Only explain intent, constraints, or non-obvious decisions**
- **All comments in English**
- **Single-line comments only** (no multi-line blocks)

## Prohibited Patterns

```typescript
// WRONG: Restates the code
const user = await getUser(); // Get the user

// WRONG: Multiple obvious comments
const id = request.params.id; // Extract ID from params
const user = await db.query(id); // Query database
const response = { user }; // Create response object

// WRONG: Multi-line block comments
/**
 * This function fetches a user by ID.
 * It takes the ID as a parameter.
 * Returns the user object.
 */
async function getUser(id: string) { }
```

## Correct Patterns

```typescript
// Hidden constraint: user ID is immutable, validate on insert only
const userId = request.params.id;

// Non-obvious: database doesn't auto-encrypt passwords, service layer handles it
const user = await db.query<User>('SELECT * FROM users WHERE id = ?', [id]);

// Workaround: Zustand skipHydration avoids race condition on app start
const useAuthStore = create<AuthState>()(
 persist(
 (set) => ({ /* ... */ }),
 { name: STORAGE_KEYS.userSession, skipHydration: true }
 )
);
```

## When to Comment

### DO comment:
- **Workarounds** for known bugs or library limitations
- **Non-obvious intent** that isn't captured by function/variable names
- **Hidden constraints** (immutability, race conditions, security assumptions)
- **Performance decisions** (why we cache here, why we batch there)
- **Subtle invariants** that would break if changed

### DON'T comment:
- Loop logic (clear from iteration)
- Variable assignments (clear from naming)
- Return statements (clear from function signature)
- Conditional branches (clear from condition)
- Function parameters (clear from types)

## Examples by Category

### Good: Workaround
```typescript
// Workaround: Expo SecureStore doesn't support complex objects, serialize manually
const serialized = JSON.stringify(token);
await SecureStore.setItemAsync(AUTH_TOKEN_KEY, serialized);
```

### Good: Hidden Constraint
```typescript
// User role is immutable after account creation (compliance requirement)
const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
```

### Good: Performance Decision
```typescript
// Batch database inserts for 10x performance on large datasets
const result = await db.transaction(() => items.map(item => insert(item)));
```

### Bad: Obvious
```typescript
// WRONG: Loop over all users
users.forEach(user => {
 // WRONG: Add to map
 userMap.set(user.id, user);
});

// CORRECT: No comments needed; code is self-explanatory
const userMap = new Map(users.map(user => [user.id, user]));
```

## Counting Comments

**File with 2 comments (GOOD)**:
```typescript
// Workaround: Database connection pooling fails on first app load, retry needed
async function initializeDatabase() { }

// Performance: Batch updates in transactions for 10x speedup
await db.transaction(async () => { });
```

**File with 5 comments (EXCEPTIONAL, needs justification)**:
```typescript
// Workaround: expo-sqlite doesn't support prepared statements, parametrize manually
async function query(sql, params) {
 // Security: Always use ? placeholders to prevent SQL injection
 return db.allAsync(sql, params);
}

// Hidden constraint: Zustand skipHydration prevents race condition on app start
export const useAuthStore = create()(persist(..., { skipHydration: true }));

// Performance: Cache store result to avoid re-renders on unchanged state
const user = useAuthStore(state => state.user);

// Non-obvious: Throw specific error code for i18n translation in UI
throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Invalid username/password');
```

## Language

- **Only English** for all comments
- No code-switching (no Spanish/English mix)
- Short, direct phrasing

```typescript
// WRONG (Spanish)
// Usuario inválido

// WRONG (Mixed)
// Usuario invalid — no puedes continuar

// CORRECT (English, concise)
// Invalid user: check email verification status
```

## Lint Enforcement (Future)

When ESLint rule is added:

```bash
pnpm run lint # Warns on:
# - Multi-line comments
# - Non-English comments
# - More than 5 comments per file
```

For now, enforce via code review.

## Principle

**Well-named code is self-documenting.** If you need a comment to understand the code, rename the code instead.

Bad:
```typescript
const x = a.filter(b => b.c === d); // Filter active users
```

Good:
```typescript
const activeUsers = allUsers.filter(user => user.isActive === true);
```

No comment needed.
