import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react-native';

import { AppInput } from '@shared/ui';

import { renderWithProviders } from '@test/utils/renderWithProviders';

describe('AppInput', () => {
  it('renders with its placeholder', async () => {
    await renderWithProviders(<AppInput placeholder="Usuario" value="" onChangeText={jest.fn()} />);
    expect(screen.getByPlaceholderText('Usuario')).toBeTruthy();
  });

  it('emits onChangeText when the text changes', async () => {
    const onChangeText = jest.fn();
    await renderWithProviders(<AppInput placeholder="Usuario" value="" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Usuario'), 'admin');
    expect(onChangeText).toHaveBeenCalledWith('admin');
  });
});
