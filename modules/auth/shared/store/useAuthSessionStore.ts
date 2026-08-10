import { create } from 'zustand';

import { useAuthStore } from '@shared/stores/useAuthStore';

import type { AuthSessionState } from '../types';

interface AuthSessionActions {
  login: (username: string, password: string) => Promise<void>;
  navigateToStep: (step: 'login' | 'register') => void;
}

// Session state lives in the shared auth store; this only tracks module-local UI state
export const useAuthSessionStore = create<AuthSessionState & AuthSessionActions>((set) => ({
  isLoading: false,
  currentStep: 'login',

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      useAuthStore.getState().login(username, password);
    } finally {
      set({ isLoading: false });
    }
  },

  navigateToStep: (step) => {
    set({ currentStep: step });
  },
}));
