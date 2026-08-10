import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';

import { semantic, textPresets, typography, useTheme } from '@shared/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  h1: textPresets.h1,
  h2: textPresets.h2,
  h3: textPresets.h3,
  body: textPresets.body,
  caption: textPresets.caption,
  small: { fontSize: typography.sizes.small, fontWeight: '500' },
};

export function AppText({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { isDark } = useTheme();

  const defaultColor = color || (isDark ? semantic.dark.text : semantic.light.text);

  return (
    <Text style={[variantStyles[variant], { color: defaultColor }, style]} {...rest}>
      {children}
    </Text>
  );
}
