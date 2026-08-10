import React from 'react';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { semantic, layout, spacing, useTheme } from '@shared/theme';

interface AppScreenProps {
  children: React.ReactNode;
  scrollContentStyle?: ViewStyle;
}

export function AppScreen({ children, scrollContentStyle }: AppScreenProps) {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? semantic.dark.background : semantic.light.background;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollBody, scrollContentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollBody: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: layout.screenPaddingVertical,
    paddingBottom: spacing.extraLarge,
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
    gap: layout.gap,
  },
});
