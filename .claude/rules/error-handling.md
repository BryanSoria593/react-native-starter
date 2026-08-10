# Error Handling — Standardized Error Codes and Propagation

All errors use typed `AppError` with specific error codes, enabling consistent UI feedback and error tracking.

## Rule

- Catch errors in services, throw typed `AppError`
- Propagate to stores, which catch and set error state
- UI components display error messages via i18n keys

## Error Types Structure

```typescript
// shared/types/errors.types.ts

export class AppError extends Error {
 constructor(
 public code: string,
 message: string,
 public statusCode?: number,
 public details?: Record<string, unknown>
 ) {
 super(message);
 this.name = 'AppError';
 }
}

export const ErrorCodes = {
 // Authentication
 INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
 SESSION_EXPIRED: 'SESSION_EXPIRED',
 UNAUTHORIZED: 'UNAUTHORIZED',
 
 // Network
 NETWORK_ERROR: 'NETWORK_ERROR',
 TIMEOUT: 'TIMEOUT',
 REQUEST_FAILED: 'REQUEST_FAILED',
 
 // Validation
 VALIDATION_ERROR: 'VALIDATION_ERROR',
 INVALID_INPUT: 'INVALID_INPUT',
 
 // Server
 SERVER_ERROR: 'SERVER_ERROR',
 NOT_FOUND: 'NOT_FOUND',
 CONFLICT: 'CONFLICT',
 
 // Database
 DATABASE_ERROR: 'DATABASE_ERROR',
 QUERY_FAILED: 'QUERY_FAILED',
 
 // Unknown
 UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
```

## Service Layer Error Handling

```typescript
// shared/services/api/ApiService.ts
import { AppError, ErrorCodes } from '@shared/types/errors.types';

export class ApiService {
 async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
 try {
 const response = await fetch(
 `${API_CONFIG.BASE_URL}${endpoint}`,
 { ...options, timeout: API_CONFIG.TIMEOUT }
 );

 if (!response.ok) {
 const errorData = await response.json().catch(() => ({}));
 throw new AppError(
 errorData.code || ErrorCodes.SERVER_ERROR,
 errorData.message || 'Server error',
 response.status,
 errorData.details
 );
 }

 return response.json();
 } catch (error) {
 // Already an AppError
 if (error instanceof AppError) throw error;

 // Network error
 if (error instanceof TypeError && error.message.includes('fetch')) {
 throw new AppError(
 ErrorCodes.NETWORK_ERROR,
 'Unable to reach server',
 undefined,
 { originalError: error.message }
 );
 }

 // Unknown error
 throw new AppError(
 ErrorCodes.UNKNOWN_ERROR,
 error instanceof Error ? error.message : 'Unknown error occurred'
 );
 }
 }
}
```

## Store Error Handling

```typescript
// shared/stores/useAuthStore.ts
export interface AuthState {
 user: User | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 errorCode: string | null; // Store the error CODE, not message
}

interface AuthActions {
 login: (username: string, password: string) => Promise<void>;
 clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
 user: null,
 isAuthenticated: false,
 isLoading: false,
 errorCode: null,

 login: async (username: string, password: string) => {
 set({ isLoading: true, errorCode: null });
 try {
 // ... login logic
 } catch (error) {
 const errorCode = error instanceof AppError
 ? error.code
 : ErrorCodes.UNKNOWN_ERROR;
 
 set({ errorCode });
 console.error('[AuthStore] Login failed:', errorCode, error);
 throw error; // Re-throw for component handling if needed
 } finally {
 set({ isLoading: false });
 }
 },

 clearError: () => set({ errorCode: null }),
}));
```

## Component Error Display

```typescript
// app/screens/LoginScreen.tsx
import { useTranslation } from '@shared/i18n';
import { useAuthStore } from '@shared/stores/useAuthStore';

export function LoginScreen() {
 const t = useTranslation();
 const errorCode = useAuthStore((state) => state.errorCode);
 const clearError = useAuthStore((state) => state.clearError);

 useEffect(() => {
 if (errorCode) {
 // Translate error code to user-friendly message
 const errorMessageKey = `errors.${errorCode}`;
 const errorMessage = t(errorMessageKey);
 
 // Show toast/alert
 showErrorToast(errorMessage);
 
 // Auto-clear after 5 seconds
 const timer = setTimeout(clearError, 5000);
 return () => clearTimeout(timer);
 }
 }, [errorCode, clearError, t]);

 return (
 <View>
 {errorCode && (
 <ErrorBanner message={t(`errors.${errorCode}`)} onDismiss={clearError} />
 )}
 {/* ... form */}
 </View>
 );
}
```

## i18n Error Messages

All error codes have translations in **es.json** and **en.json**:

```json
{
 "errors.INVALID_CREDENTIALS": "Credenciales inválidas",
 "errors.SESSION_EXPIRED": "Tu sesión expiró, inicia de nuevo",
 "errors.UNAUTHORIZED": "No tienes permiso para hacer esto",
 "errors.NETWORK_ERROR": "Error de conexión, verifica tu internet",
 "errors.TIMEOUT": "La solicitud tardó demasiado, intenta de nuevo",
 "errors.VALIDATION_ERROR": "Datos inválidos",
 "errors.SERVER_ERROR": "Error del servidor, intenta más tarde",
 "errors.NOT_FOUND": "Recurso no encontrado",
 "errors.DATABASE_ERROR": "Error en la base de datos",
 "errors.UNKNOWN_ERROR": "Ocurrió un error inesperado"
}
```

## Error Handling Patterns

### Pattern 1: Service → Store → UI

```typescript
// Service throws AppError
async fetchUser() {
 const response = await services.api.fetch('/user');
 // throws AppError(NETWORK_ERROR) or AppError(SERVER_ERROR)
}

// Store catches and stores code
const fetchUser = async () => {
 try {
 await services.api.fetch('/user');
 } catch (error) {
 const code = error instanceof AppError ? error.code : UNKNOWN_ERROR;
 set({ errorCode: code });
 }
}

// UI displays translated message
const errorMessage = t(`errors.${errorCode}`);
```

### Pattern 2: Database Transaction Error

```typescript
async function createPayment(payment: Payment) {
 try {
 await services.database.transaction(async (db) => {
 await db.execute('INSERT INTO payments ...', [...]);
 // If fails, transaction rolls back automatically
 });
 } catch (error) {
 throw new AppError(
 ErrorCodes.DATABASE_ERROR,
 'Failed to create payment',
 undefined,
 { originalError: error }
 );
 }
}
```

### Pattern 3: Validation Error

```typescript
function validateLoginForm(username: string, password: string): void {
 if (!username.trim()) {
 throw new AppError(
 ErrorCodes.VALIDATION_ERROR,
 'Username is required'
 );
 }
 if (password.length < 8) {
 throw new AppError(
 ErrorCodes.VALIDATION_ERROR,
 'Password must be at least 8 characters'
 );
 }
}
```

## Logging Errors

```typescript
// shared/services/logger/LoggerService.ts
export class LoggerService {
 error(tag: string, message: string, error?: Error | AppError) {
 console.error(`[${tag}] ${message}`, error);
 
 // Send to crash reporting (Sentry, etc.)
 if (error instanceof AppError) {
 reportError({
 code: error.code,
 message: error.message,
 statusCode: error.statusCode,
 details: error.details,
 });
 }
 }
}
```

## Testing Error Scenarios

```typescript
// test/unit/stores/useAuthStore.test.ts
it('should set error code on login failure', async () => {
 await expect(
 useAuthStore.getState().login('invalid', 'wrong')
 ).rejects.toThrow();
 
 const { errorCode } = useAuthStore.getState();
 expect(errorCode).toBe(ErrorCodes.INVALID_CREDENTIALS);
});

it('should clear error on success', async () => {
 // First set an error
 useAuthStore.setState({ errorCode: ErrorCodes.NETWORK_ERROR });
 
 // Clear it
 useAuthStore.getState().clearError();
 
 expect(useAuthStore.getState().errorCode).toBeNull();
});
```

## Best Practices

CORRECT: **Dos:**
- Use specific error codes (not generic strings)
- Log with context `[ServiceName]` prefix
- Catch at service level, propagate codes to store
- Translate codes in UI (via i18n)
- Always set `isLoading = false` in `finally` block

WRONG: **Don'ts:**
- Throw generic `Error` (use `AppError`)
- Show stack traces to users
- Log sensitive data (tokens, passwords)
- Leave errors unhandled in async operations
- Use `console.error` without context

## Error Recovery

When appropriate, implement retry logic:

```typescript
async function fetchWithRetry<T>(
 endpoint: string,
 maxRetries = 3
): Promise<T> {
 let lastError: AppError | null = null;

 for (let i = 0; i < maxRetries; i++) {
 try {
 return await services.api.fetch(endpoint);
 } catch (error) {
 lastError = error instanceof AppError ? error : new AppError(UNKNOWN_ERROR, String(error));
 
 if (i < maxRetries - 1) {
 await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // Exponential backoff
 }
 }
 }

 throw lastError;
}
```
