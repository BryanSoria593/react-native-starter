import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Auth: undefined;
};

export type AppTabParamList = {
  Todos: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  ModuleRunner: { moduleId: string };
};
