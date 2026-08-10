// Pin the timezone so any time-formatting test is deterministic across CI runners.
process.env.TZ = 'UTC';

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  testMatch: ['**/test/**/*.test.ts', '**/test/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          module: 'commonjs',
          esModuleInterop: true,
          resolveJsonModule: true,
          strict: true,
          noUncheckedIndexedAccess: false,
          paths: {
            '@shared/*': ['./shared/*'],
            '@modules/*': ['./modules/*'],
            '@app/*': ['./app/*'],
            '@test/*': ['./test/*'],
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    // Native-backed modules → lightweight mocks so component tests render in Node.
    '^react-native$': '<rootDir>/test/mocks/react-native.mock.ts',
    '^react-native-safe-area-context$': '<rootDir>/test/mocks/react-native-safe-area-context.mock.ts',
    '^@react-navigation/native$': '<rootDir>/test/mocks/react-navigation-native.mock.ts',
    '@expo/vector-icons': '<rootDir>/test/mocks/expo-vector-icons.mock.ts',
    '@react-native-async-storage/async-storage': '<rootDir>/test/mocks/async-storage.mock.ts',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
    '^@app/(.*)$': '<rootDir>/app/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
};
