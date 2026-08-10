import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useTranslation } from '@shared/i18n';
import { colors, semantic, useTheme } from '@shared/theme';
import type { AppTabParamList, RootStackParamList } from '@shared/types/navigation.types';

import { TodosModule } from '@modules/todos';

import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<AppTabParamList>();

function MainTabs() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const themeColors = isDark ? semantic.dark : semantic.light;

  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: colors.violet600,
        tabBarInactiveTintColor: colors.gray400,
        tabBarStyle: {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
        },
      }}
    >
      <MainTab.Screen
        name="Todos"
        component={TodosModule}
        options={{
          title: t('todos.tabTitle'),
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-done" color={color} size={size} />,
        }}
      />

      <MainTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('settings.tabTitle'),
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />

      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('profile.tabTitle'),
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </MainTab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
    </RootStack.Navigator>
  );
}
