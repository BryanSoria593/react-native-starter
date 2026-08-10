import React from 'react';
import { jest } from '@jest/globals';

// Modulenamemapper intercepts react-native; primitives are real React components
type ChildrenProps = { children?: React.ReactNode; style?: unknown; [key: string]: unknown };

const passThrough = (displayName: string) => {
  const Component = ({ children }: ChildrenProps) =>
    React.createElement(React.Fragment, null, children ?? null);
  Component.displayName = displayName;
  return Component;
};

export const View = passThrough('View');
export const Text = ({ children }: ChildrenProps) =>
  React.createElement('Text', null, children ?? null);

export const TextInput = ({
  onChangeText,
  placeholder,
  value,
  ...rest
}: {
  onChangeText?: (text: string) => void;
  placeholder?: string;
  value?: string;
  [key: string]: unknown;
}) => React.createElement('TextInput', { onChangeText, placeholder, value, ...rest }, null);

export const ScrollView = passThrough('ScrollView');

export const Pressable = ({
  children,
  onPress,
  disabled,
  style,
  ...rest
}: {
  children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
  onPress?: () => void;
  disabled?: boolean;
  style?: unknown | ((state: { pressed: boolean }) => unknown);
  [key: string]: unknown;
}) => {
  const resolvedChildren = typeof children === 'function' ? children({ pressed: false }) : children;
  const resolvedStyle = typeof style === 'function' ? style({ pressed: false }) : style;
  // Only wire onPress when not disabled — mirrors real Pressable so tests can verify disabling.
  const handlePress = disabled ? undefined : onPress;
  return React.createElement(
    'Pressable',
    { onPress: handlePress, disabled, style: resolvedStyle, ...rest },
    resolvedChildren ?? null,
  );
};

export const TouchableOpacity = passThrough('TouchableOpacity');
export const FlatList = passThrough('FlatList');
export const Image = passThrough('Image');
export const Modal = ({
  children,
  visible,
}: {
  children?: React.ReactNode;
  visible?: boolean;
  [key: string]: unknown;
}) => (visible ? React.createElement(React.Fragment, null, children ?? null) : null);
export const ActivityIndicator = () => null;
export const Switch = ({
  value,
  onValueChange,
  ...rest
}: {
  value?: boolean;
  onValueChange?: (newValue: boolean) => void;
  [key: string]: unknown;
}) => React.createElement('Switch', { value, onValueChange, ...rest });
export const KeyboardAvoidingView = passThrough('KeyboardAvoidingView');
export const SafeAreaView = passThrough('SafeAreaView');
export const StatusBar = () => null;

export const Keyboard: {
  dismiss: () => void;
  addListener: () => { remove: () => void };
} = {
  dismiss: jest.fn<() => void>(),
  addListener: jest.fn<() => { remove: () => void }>(() => ({ remove: jest.fn<() => void>() })),
};

export const Platform = {
  OS: 'android' as const,
  select: <T extends object>(specifics: T): T[keyof T] => {
    const key = 'android' as keyof T;
    return (specifics[key] ?? (specifics as unknown as Record<string, unknown>).default) as T[keyof T];
  },
  Version: 30,
};

export const Alert: { alert: (title: string) => void } = {
  alert: jest.fn<(title: string) => void>(),
};
export const Vibration: { vibrate: (duration?: number) => void; cancel: () => void } = {
  vibrate: jest.fn<(duration?: number) => void>(),
  cancel: jest.fn<() => void>(),
};

export const StyleSheet: {
  create: <T extends object>(styles: T) => T;
  flatten: (style: unknown) => unknown;
  hairlineWidth: number;
  absoluteFillObject: { position: 'absolute'; left: number; right: number; top: number; bottom: number };
} = {
  create: <T extends object>(styles: T): T => styles,
  flatten: jest.fn<(style: unknown) => unknown>((style: unknown) => style),
  hairlineWidth: 1,
  absoluteFillObject: { position: 'absolute' as const, left: 0, right: 0, top: 0, bottom: 0 },
};

type DimensionsValue = { width: number; height: number; scale: number; fontScale: number };

export const Dimensions: {
  get: () => DimensionsValue;
  addEventListener: () => { remove: () => void };
} = {
  get: jest.fn<() => DimensionsValue>(() => ({
    width: 375,
    height: 812,
    scale: 2,
    fontScale: 1,
  })),
  addEventListener: jest.fn<() => { remove: () => void }>(() => ({ remove: jest.fn<() => void>() })),
};

export const useWindowDimensions: () => DimensionsValue = jest.fn<() => DimensionsValue>(() => ({
  width: 375,
  height: 812,
  scale: 2,
  fontScale: 1,
}));

export const useColorScheme: () => 'light' | 'dark' | null = jest.fn<() => 'light' | 'dark' | null>(
  () => 'light',
);
