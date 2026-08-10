import { describe, it, expect, beforeEach } from '@jest/globals';

import { useAuthStore } from '@shared/stores/useAuthStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('authenticates with the valid demo credentials', () => {
    useAuthStore.getState().login('admin', '1234');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.username).toBe('admin');
  });

  it('throws and stays unauthenticated with invalid credentials', () => {
    expect(() => useAuthStore.getState().login('admin', 'wrong')).toThrow();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('clears the session on logout', () => {
    useAuthStore.getState().login('admin', '1234');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});
