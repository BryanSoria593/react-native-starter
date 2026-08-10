import React from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { semantic, radii, typography, useTheme } from '@shared/theme';

interface AppInputProps extends TextInputProps {
  height?: number;
  activeColor?: string;
}

export function AppInput({ height = 54, activeColor, style, value, ...rest }: AppInputProps) {
  const { isDark } = useTheme();
  const themeColors = isDark ? semantic.dark : semantic.light;

  const hasValue = typeof value === 'string' && value.length > 0;
  const borderColor = hasValue && activeColor ? activeColor : themeColors.border;

  return (
    <TextInput
      value={value}
      placeholderTextColor={themeColors.textSecondary}
      style={[
        styles.input,
        { height, borderColor, backgroundColor: themeColors.surface, color: themeColors.text },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: radii.medium,
    borderWidth: 2,
    paddingHorizontal: 14,
    fontSize: typography.sizes.body,
    fontWeight: '500',
  },
});
