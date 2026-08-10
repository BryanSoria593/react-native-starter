import React from 'react';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react-native';

import { AppButton } from '@shared/ui';

import { renderWithProviders } from '@test/utils/renderWithProviders';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AppButton', () => {
  it('renders its label', async () => {
    await renderWithProviders(<AppButton label="Entrar" onPress={jest.fn()} />);
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithProviders(<AppButton label="Entrar" onPress={onPress} />);
    fireEvent.press(screen.getByText('Entrar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('marks the underlying pressable as disabled', async () => {
    await renderWithProviders(<AppButton label="Entrar" onPress={jest.fn()} disabled />);

    // Pressable prop is on parent, not the Text element itself
    let node: ReturnType<typeof screen.getByText> | null = screen.getByText('Entrar');
    let isDisabled: boolean | undefined;
    while (node) {
      if (typeof node.props?.disabled === 'boolean') {
        isDisabled = node.props.disabled;
        break;
      }
      node = node.parent;
    }
    expect(isDisabled).toBe(true);
  });
});
