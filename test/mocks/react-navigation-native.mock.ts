import React from 'react';
import { jest } from '@jest/globals';

export const useNavigation = jest.fn(() => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
}));

export const useRoute = jest.fn(() => ({ params: {} }));
export const useFocusEffect = jest.fn((callback: () => void | (() => void)) => {
  callback();
});
export const useIsFocused = jest.fn(() => true);
export const NavigationContainer = ({ children }: { children: React.ReactNode }) => children;
