export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  setupFiles: ['<rootDir>/tests/setup.ts'],

  clearMocks: true,

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  transform: {
    '^.+\\.ts$': ['ts-jest', { useESM: true }],
  },

  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
};