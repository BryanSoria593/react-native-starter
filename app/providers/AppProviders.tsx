import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

import { I18nProvider } from '@shared/i18n';
import { useAuthStore } from '@shared/stores/useAuthStore';
import { colors, semantic, ThemeProvider, useTheme } from '@shared/theme';

// Rehydrate persisted stores before first render to avoid flash of unauthenticated state
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const rehydratePersistedStores = async () => {
      await useAuthStore.persist.rehydrate();
      setIsReady(true);
    };
    void rehydratePersistedStores();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.gray400} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ThemedNavigation>{children}</ThemedNavigation>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

function ThemedNavigation({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const themeColors = isDark ? semantic.dark : semantic.light;

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: themeColors.background,
      card: themeColors.surface,
      border: themeColors.border,
      text: themeColors.text,
    },
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navigationTheme}>
        <I18nProvider>{children}</I18nProvider>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
