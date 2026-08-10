export const typography = {
  sizes: {
    h1: 36,
    h2: 28,
    h3: 24,
    h4: 20,
    body: 16,
    caption: 14,
    small: 13,
    micro: 12,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
} as const;

export const textPresets = {
  h1: { fontSize: typography.sizes.h1, fontWeight: '700' as const, lineHeight: Math.round(typography.sizes.h1 * 1.2) },
  h2: { fontSize: typography.sizes.h2, fontWeight: '600' as const, lineHeight: Math.round(typography.sizes.h2 * 1.3) },
  h3: { fontSize: typography.sizes.h3, fontWeight: '600' as const, lineHeight: Math.round(typography.sizes.h3 * 1.4) },
  body: { fontSize: typography.sizes.body, fontWeight: '400' as const, lineHeight: Math.round(typography.sizes.body * 1.5) },
  caption: { fontSize: typography.sizes.caption, fontWeight: '500' as const, lineHeight: Math.round(typography.sizes.caption * 1.4) },
  buttonLabel: { fontSize: typography.sizes.body, fontWeight: '600' as const, letterSpacing: 0.3 },
  fieldLabel: { fontSize: typography.sizes.caption, fontWeight: '500' as const, letterSpacing: 0.2 },
} as const;
