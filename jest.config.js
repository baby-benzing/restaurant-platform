module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        moduleResolution: 'node',
        allowImportingTsExtensions: false,
        esModuleInterop: true,
        paths: {
          '@restaurant-platform/web-common': ['./packages/web-common/src'],
          '@restaurant-platform/database': ['./packages/database/src'],
          '@restaurant-platform/admin': ['./packages/admin/src']
        }
      }
    }]
  },
  moduleNameMapper: {
    '^@restaurant-platform/web-common$': '<rootDir>/packages/web-common/src',
    '^@restaurant-platform/database$': '<rootDir>/packages/database/src',
    '^@restaurant-platform/admin$': '<rootDir>/packages/admin/src'
  },
  collectCoverageFrom: [
    'tests/**/*.{js,ts}',
    '!tests/**/*.test.{js,ts}'
  ],
  coverageDirectory: 'coverage',
  clearMocks: true,
  restoreMocks: true
};