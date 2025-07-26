module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/server/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@database/(.*)$': '<rootDir>/database/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  },
  testTimeout: 30000,
  globalTeardown: '<rootDir>/tests/teardown.ts'
};