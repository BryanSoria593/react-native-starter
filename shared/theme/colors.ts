// Add new colors here; never inline hex in components (theme-tokens-only rule)
export const colors = {
  white: '#ffffff',
  gray50: '#f8f9fa',
  gray100: '#f0f2f5',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#0f1117',

  violet50: '#f5f3ff',
  violet100: '#ede9fe',
  violet200: '#ddd6fe',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  violet700: '#6d28d9',

  coral50: '#fff5f3',
  coral100: '#ffe4df',
  coral500: '#ff6b52',
  coral600: '#f85a44',
  coral700: '#ea4a38',

  cyan500: '#06b6d4',
  cyan600: '#0891b2',

  success50: '#f0fdf4',
  success500: '#22c55e',
  success600: '#16a34a',
  warning500: '#f59e0b',
  error50: '#fef2f2',
  error500: '#ef4444',
  error600: '#dc2626',

  dark50: '#1e1e2e',
  dark100: '#2a2a3e',
  dark200: '#353550',
  dark800: '#0a0a0f',
  dark900: '#050508',
} as const;

export const semantic = {
  light: {
    background: colors.white,
    surface: colors.gray50,
    surfaceSecondary: colors.gray100,
    border: colors.gray200,
    borderStrong: colors.gray300,
    text: colors.gray900,
    textSecondary: colors.gray600,
    textTertiary: colors.gray500,
    textDisabled: colors.gray400,
    textOnPrimary: colors.white,
  },

  dark: {
    background: colors.dark800,
    surface: colors.dark50,
    surfaceSecondary: colors.dark100,
    border: colors.dark200,
    borderStrong: colors.gray600,
    text: colors.gray50,
    textSecondary: colors.gray300,
    textTertiary: colors.gray400,
    textDisabled: colors.gray500,
    textOnPrimary: colors.white,
  },

  primary: {
    default: colors.violet600,
    hover: colors.violet700,
    active: colors.violet700,
    light: colors.violet50,
  },
  secondary: {
    default: colors.coral600,
    hover: colors.coral700,
    active: colors.coral700,
    light: colors.coral50,
  },
  accent: {
    default: colors.cyan600,
    hover: colors.cyan500,
  },

  success: colors.success600,
  warning: colors.warning500,
  error: colors.error600,

  // Deprecated: kept for backwards compatibility, remove once no callers reference it
  step: {
    inactiveDot: colors.gray300,
  },
} as const;
