import React from 'react';
import { Pressable, StyleSheet, Text, Vibration, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radii, spacing, typography } from '@shared/theme';

type ButtonIntent = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outlined';

interface AppButtonProps {
  intent?: ButtonIntent;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  accentColor?: string;
}

const intentColors: Record<ButtonIntent, { background: string; text: string; border?: string }> = {
  primary: { background: colors.violet600, text: colors.white },
  secondary: { background: colors.coral600, text: colors.white },
  danger: { background: colors.error600, text: colors.white },
  ghost: { background: 'transparent', text: colors.violet600 },
  outlined: { background: colors.violet50, text: colors.violet600, border: colors.violet200 },
};

const intentHeights: Record<ButtonIntent, number> = {
  primary: 56,
  secondary: 56,
  danger: 56,
  ghost: 48,
  outlined: 56,
};

export function AppButton({
  intent = 'primary',
  label,
  onPress,
  disabled = false,
  icon,
  accentColor,
}: AppButtonProps) {
  const intentColorScheme = intentColors[intent];
  const height = intentHeights[intent];

  const background =
    accentColor && (intent === 'primary' || intent === 'secondary')
      ? accentColor
      : intentColorScheme.background;

  const containerStyle: ViewStyle = {
    height,
    borderRadius: radii.buttonPrimary,
    backgroundColor: disabled ? colors.gray300 : background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: spacing.large,
    gap: icon ? spacing.small : 0,
    ...(intentColorScheme.border
      ? { borderWidth: 2, borderColor: accentColor ?? intentColorScheme.border }
      : {}),
  };

  const textColor = disabled
    ? colors.gray500
    : intent === 'outlined' && accentColor
      ? accentColor
      : intentColorScheme.text;

  const handlePress = () => {
    Vibration.vibrate(12);
    onPress();
  };

  return (
    <Pressable
      style={({ pressed }) => [containerStyle, pressed && !disabled ? styles.pressed : undefined]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      {icon ? <Ionicons name={icon} size={20} color={textColor} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: typography.sizes.body,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
