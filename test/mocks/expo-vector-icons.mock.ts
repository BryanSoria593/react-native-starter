import React from 'react';
import { Text } from 'react-native';
import type { ComponentProps } from 'react';

const MockIcon = ({ name, ...props }: { name?: string } & ComponentProps<typeof Text>) =>
  React.createElement(Text, props, name ?? '');

export const Ionicons = MockIcon;
export const MaterialIcons = MockIcon;
export const MaterialCommunityIcons = MockIcon;
export const FontAwesome = MockIcon;
export const Feather = MockIcon;
export const AntDesign = MockIcon;
export const Entypo = MockIcon;
