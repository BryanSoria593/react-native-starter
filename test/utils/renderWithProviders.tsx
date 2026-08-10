import React from 'react';
import { render } from '@testing-library/react-native';
import type { RenderOptions, RenderResult } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { I18nProvider } from '@shared/i18n/I18nProvider';
import { ThemeProvider } from '@shared/theme/ThemeContext';

export async function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): Promise<RenderResult> {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>{children}</I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}
