import React from 'react';

import { useAuthStore } from '@shared/stores/useAuthStore';

import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
