import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User } from '@shared/types/user.types';
import { STORAGE_KEYS } from '@shared/constants/storageKeys';

import { zustandStorageAdapter } from './zustandStorageAdapter';

// Demo only: replace with real auth service in production
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = '1234';

export const INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (username: string, password: string) => void;
  logout: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialAuthState,

      login: (username: string, password: string) => {
        const trimmedUsername = username.trim();
        const hasValidCredentials =
          trimmedUsername === DEMO_USERNAME && password === DEMO_PASSWORD;

        if (!hasValidCredentials) {
          throw new Error(INVALID_CREDENTIALS_ERROR);
        }

        set({
          user: { id: 'demo-user', username: trimmedUsername, role: 'admin' },
          isAuthenticated: true,
        });
      },

      logout: () => set(initialAuthState),
    }),
    {
      name: STORAGE_KEYS.userSession,
      storage: zustandStorageAdapter,
      skipHydration: true,
    },
  ),
);
