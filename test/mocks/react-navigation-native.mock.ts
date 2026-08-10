import React from 'react';
import { jest } from '@jest/globals';

type NavigationMock = {
  navigate: () => void;
  goBack: () => void;
  dispatch: () => void;
  setOptions: () => void;
};

export const useNavigation: () => NavigationMock = jest.fn<() => NavigationMock>(() => ({
  navigate: jest.fn<() => void>(),
  goBack: jest.fn<() => void>(),
  dispatch: jest.fn<() => void>(),
  setOptions: jest.fn<() => void>(),
}));

export const useRoute: () => { params: object } = jest.fn<() => { params: object }>(() => ({
  params: {},
}));
export const useFocusEffect: (callback: () => void | (() => void)) => void = jest.fn(
  (callback: () => void | (() => void)) => {
    callback();
  },
);
export const useIsFocused: () => boolean = jest.fn<() => boolean>(() => true);
export const NavigationContainer = ({ children }: { children: React.ReactNode }) => children;
