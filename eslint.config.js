// ESLint 9 flat config. Extends Expo's flat config and layers the architecture boundary rules,
// import ordering, the service-layer import restriction, and theme/i18n guardrails.
const boundaries = require('eslint-plugin-boundaries');
const expoFlatConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoFlatConfig,

  {
    ignores: ['node_modules/**', 'dist/**', '.expo/**', 'web-build/**'],
  },

  // ─── architecture boundaries + import order + service-layer (all files) ─────
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'shared', pattern: 'shared/*' },
        // Module-internal shared/** (types, constants, hooks, …) is classified as 'shared'.
        { type: 'shared', pattern: 'modules/*/shared/**' },
        { type: 'modules', pattern: 'modules/*' },
        { type: 'app', pattern: 'app/*' },
        { type: 'test', pattern: 'test/*' },
      ],
      'boundaries/ignore': ['**/*.test.ts', '**/*.test.tsx'],
    },
    rules: {
      'max-lines': ['warn', { max: 1500, skipBlankLines: true, skipComments: true }],
      'boundaries/dependencies': [
        2,
        {
          default: 'disallow',
          rules: [
            { from: { type: 'shared' }, allow: { to: { type: 'shared' } } },
            {
              from: { type: 'shared', path: 'modules/*/shared/**' },
              allow: { to: { type: ['shared', 'modules'] } },
            },
            { from: { type: 'modules' }, allow: { to: { type: 'shared' } } },
            { from: { type: 'app' }, allow: { to: { type: ['shared', 'modules', 'app'] } } },
            { from: { type: 'test' }, allow: { to: { type: ['shared', 'modules', 'app'] } } },
          ],
        },
      ],
      'import/order': [
        1,
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
          pathGroups: [
            { pattern: '@shared/**', group: 'internal', position: 'before' },
            { pattern: '@modules/**', group: 'internal', position: 'after' },
            { pattern: '@app/**', group: 'internal', position: 'after' },
            { pattern: '@test/**', group: 'internal', position: 'after' },
          ],
          'newlines-between': 'always',
        },
      ],
      'no-restricted-imports': [
        2,
        {
          paths: [
            {
              name: '@react-native-async-storage/async-storage',
              message: 'Use services.storage from @shared/services instead (service-layer).',
            },
          ],
        },
      ],
    },
  },

  // ─── no-explicit-any: warn project-wide on TS (modules/** escalates to error below) ─────
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // ─── service implementations may import native packages directly ─────
  {
    files: ['shared/services/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },

  // ─── theme-token + i18n guardrails for modules/** (error) ─────
  {
    files: ['modules/**/*.{ts,tsx}'],
    ignores: ['**/shared/constants/**', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9A-Fa-f]{3,8}$/]',
          message:
            'Hardcoded hex color. Use tokens from @shared/theme (theme-tokens-only). Module accent literals belong in shared/constants/.',
        },
        {
          selector: "CallExpression[callee.name='t'] Property[key.name='defaultValue']",
          message:
            'i18n t() must not use defaultValue (i18n-required). Add the key to es.json and en.json instead.',
        },
        {
          selector: "Property[key.name='fontSize'] > Literal[raw=/^[0-9.]/]",
          message: 'Bare numeric fontSize. Use typography.sizes.* from @shared/theme (theme-tokens-only).',
        },
        {
          selector: "Property[key.name='borderRadius'] > Literal[raw=/^[0-9.]/]",
          message: 'Bare numeric borderRadius. Use radii.* from @shared/theme (theme-tokens-only).',
        },
      ],
    },
  },

  // ─── same guardrails for shared/ui (error) ─────
  {
    files: ['shared/ui/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9A-Fa-f]{3,8}$/]',
          message: 'Hardcoded hex color in shared/ui. Use tokens from @shared/theme (theme-tokens-only).',
        },
        {
          selector: "CallExpression[callee.name='t'] Property[key.name='defaultValue']",
          message: 'i18n t() must not use defaultValue (i18n-required).',
        },
        {
          selector: "Property[key.name='fontSize'] > Literal[raw=/^[0-9.]/]",
          message: 'Bare numeric fontSize in shared/ui. Use typography.sizes.* from @shared/theme.',
        },
        {
          selector: "Property[key.name='borderRadius'] > Literal[raw=/^[0-9.]/]",
          message: 'Bare numeric borderRadius in shared/ui. Use radii.* from @shared/theme.',
        },
      ],
    },
  },

  // ─── token guardrails for app/** (warn-staged) ─────
  {
    files: ['app/**/*.{ts,tsx}'],
    ignores: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-console': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          selector: "Property[key.name='fontSize'] > Literal[raw=/^[0-9.]/]",
          message: 'Bare numeric fontSize. Use typography.sizes.* from @shared/theme (theme-tokens-only).',
        },
        {
          selector: "Property[key.name='borderRadius'] > Literal[raw=/^[0-9.]/]",
          message: 'Bare numeric borderRadius. Use radii.* from @shared/theme (theme-tokens-only).',
        },
      ],
    },
  },
];
