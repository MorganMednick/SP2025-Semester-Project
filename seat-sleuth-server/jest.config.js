/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  reporters: ['default', 'jest-summary-reporter'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/tests/**', '!src/test/**', '!src/__tests__/**', '!src/types/**'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
