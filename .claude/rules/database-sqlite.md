# Database (SQLite) — Structure, Migrations, and Type Safety

SQLite database access through `DatabaseService` in `shared/services/`, with versioned migrations and type-safe queries.

## Rule

- Database setup only in `DatabaseService` class
- All queries parametrized (prevent SQL injection)
- Migrations versioned in `runMigrations()`
- Type-safe query results using generics
- Transactions for multi-step operations

## Implementation

### 1. DatabaseService Structure

```typescript
// shared/services/database/DatabaseService.ts
import * as SQLite from 'expo-sqlite';

interface DatabaseConfig {
 name: string;
 version: number;
}

export class DatabaseService {
 private db: SQLite.SQLiteDatabase | null = null;
 private config: DatabaseConfig;

 constructor(config: DatabaseConfig = { name: 'templateapp.db', version: 1 }) {
 this.config = config;
 }

 async initialize(): Promise<void> {
 try {
 this.db = await SQLite.openDatabaseAsync(this.config.name);
 await this.runMigrations();
 } catch (error) {
 console.error('[DatabaseService] Init failed:', error);
 throw error;
 }
 }

 private async runMigrations(): Promise<void> {
 if (!this.db) throw new Error('Database not initialized');

 // v1: Initial schema
 await this.db.execAsync(`
 CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 email TEXT,
 role TEXT NOT NULL,
 created_at INTEGER NOT NULL
 );

 CREATE TABLE IF NOT EXISTS payments (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL,
 amount REAL NOT NULL,
 status TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
 );

 CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
 CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
 `);
 }

 async query<T>(
 sql: string,
 params?: (string | number | null)[]
 ): Promise<T[]> {
 if (!this.db) throw new Error('Database not initialized');
 try {
 return (await this.db.allAsync<T>(sql, params || [])) || [];
 } catch (error) {
 console.error('[DatabaseService] Query failed:', sql, error);
 throw error;
 }
 }

 async execute(
 sql: string,
 params?: (string | number | null)[]
 ): Promise<void> {
 if (!this.db) throw new Error('Database not initialized');
 try {
 await this.db.runAsync(sql, params || []);
 } catch (error) {
 console.error('[DatabaseService] Execute failed:', sql, error);
 throw error;
 }
 }

 async transaction<T>(
 callback: (db: DatabaseService) => Promise<T>
 ): Promise<T> {
 if (!this.db) throw new Error('Database not initialized');
 try {
 await this.db.execAsync('BEGIN TRANSACTION');
 const result = await callback(this);
 await this.db.execAsync('COMMIT');
 return result;
 } catch (error) {
 await this.db.execAsync('ROLLBACK');
 throw error;
 }
 }

 async close(): Promise<void> {
 if (this.db) {
 await this.db.closeAsync();
 this.db = null;
 }
 }
}

// shared/services/database/index.ts
export { DatabaseService } from './DatabaseService';
```

### 2. Export in Service Container

```typescript
// shared/services/index.ts
import { StorageService } from './storage';
import { DatabaseService } from './database';

export const services = {
 storage: new StorageService(),
 database: new DatabaseService(),
} as const;
```

### 3. Type-Safe Queries

```typescript
// modules/payments-module/shared/types/payments.types.ts
export interface Payment {
 id: string;
 user_id: string;
 amount: number;
 status: 'pending' | 'completed' | 'failed';
 created_at: number;
}

// Uso en store
import { services } from '@shared/services';
import type { Payment } from './types/payments.types';

export const usePaymentStore = create((set) => ({
 payments: [],
 
 fetchPayments: async (userId: string) => {
 const payments = await services.database.query<Payment>(
 'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
 [userId]
 );
 set({ payments });
 },
}));
```

### 4. Transactions for Multi-Step Operations

```typescript
async function transferPayment(fromUserId: string, toUserId: string, amount: number) {
 await services.database.transaction(async (db) => {
 // Debit from-user
 await db.execute(
 'UPDATE users SET balance = balance - ? WHERE id = ?',
 [amount, fromUserId]
 );

 // Credit to-user
 await db.execute(
 'UPDATE users SET balance = balance + ? WHERE id = ?',
 [amount, toUserId]
 );

 // Log transaction
 await db.execute(
 'INSERT INTO transactions (from_id, to_id, amount, created_at) VALUES (?, ?, ?, ?)',
 [fromUserId, toUserId, amount, Date.now()]
 );
 });
}
```

## Parametrized Queries (SQL Injection Prevention)

### CORRECT: CORRECT: Parametrized

```typescript
// Parameters are ? placeholders
await services.database.query(
 'SELECT * FROM users WHERE username = ?',
 [username] // Values passed separately
);
```

### WRONG: WRONG: String Concatenation

```typescript
// SQL Injection vulnerability!
const query = `SELECT * FROM users WHERE username = '${username}'`;
await services.database.query(query);
```

## Migrations Strategy

When you need to add a new table or column:

1. Update `runMigrations()` with new schema
2. Use `CREATE TABLE IF NOT EXISTS` (idempotent)
3. Use `ALTER TABLE IF COLUMN NOT EXISTS` (for existing tables)
4. Increment version if needed for tracking

```typescript
private async runMigrations(): Promise<void> {
 // v1 tables
 await this.db.execAsync(`
 CREATE TABLE IF NOT EXISTS users (...)
 `);

 // v2 additions (safe to re-run)
 await this.db.execAsync(`
 ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login INTEGER;
 `);
}
```

## Testing Database Queries

```typescript
// test/unit/services/DatabaseService.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';
import { DatabaseService } from '@shared/services';

describe('DatabaseService', () => {
 let db: DatabaseService;

 beforeEach(async () => {
 db = new DatabaseService({ name: ':memory:' }); // In-memory for tests
 await db.initialize();
 });

 it('should insert and query users', async () => {
 await db.execute(
 'INSERT INTO users (id, username, email, role, created_at) VALUES (?, ?, ?, ?, ?)',
 ['1', 'testuser', 'test@example.com', 'admin', Date.now()]
 );

 const users = await db.query('SELECT * FROM users WHERE id = ?', ['1']);
 expect(users).toHaveLength(1);
 expect(users[0].username).toBe('testuser');
 });
});
```

## Best Practices

CORRECT: **Dos:**
- Use transactions for related operations
- Always parametrize queries
- Index foreign keys and frequently filtered columns
- Log SQL errors with context
- Test migrations with real data

WRONG: **Don'ts:**
- Hardcode values in queries
- Nest transactions
- Store sensitive data (passwords) unencrypted
- Perform heavy queries on main thread (use async)
- Skip error handling

## Backup & Recovery

```typescript
async function backupDatabase(): Promise<string> {
 const backupPath = `${FileSystem.documentDirectory}backup.db`;
 await FileSystem.copyAsync({
 from: `${FileSystem.documentDirectory}templateapp.db`,
 to: backupPath,
 });
 return backupPath;
}
```

## Performance Notes

- Queries are async (never block main thread)
- Indexes on `user_id`, `status` for quick filtering
- Batch inserts with transactions for performance
- Close database gracefully on app exit
