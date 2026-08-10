import React from 'react';
import { View } from 'react-native';
import type { ComponentProps } from 'react';

export const SafeAreaProvider = (props: ComponentProps<typeof View>) =>
  React.createElement(View, props);

export const SafeAreaView = (props: ComponentProps<typeof View>) =>
  React.createElement(View, props);

export const useSafeAreaInsets = () => ({ top: 0, bottom: 0, left: 0, right: 0 });

export const useSafeAreaFrame = () => ({ x: 0, y: 0, width: 390, height: 844 });

export const initialWindowMetrics = {
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  frame: { x: 0, y: 0, width: 390, height: 844 },
};
