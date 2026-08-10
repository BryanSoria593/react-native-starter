import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { semantic, radii, spacing, useTheme } from '@shared/theme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function AppCard({ children, onPress, style }: AppCardProps) {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? semantic.dark.surface : semantic.light.surface;
  const borderColor = isDark ? semantic.dark.border : semantic.light.border;

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderRadius: radii.card,
    borderColor,
    borderWidth: 1,
    padding: spacing.large,
    ...style,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.85,
  },
});
