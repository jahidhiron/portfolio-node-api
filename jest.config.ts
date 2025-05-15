import dotenv from 'dotenv';
import type { Config } from 'jest';

dotenv.config({ path: '.env.test' });

const config: Config = {
  // Use ts-jest to transform TypeScript files
  preset: 'ts-jest',

  // Set the test environment (Node.js for backend testing)
  testEnvironment: 'node',

  // Automatically transform TypeScript files with ts-jest
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Ignore paths such as dist and node_modules from being tested
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Allow Jest to recognize .ts and .js files
  moduleFileExtensions: ['ts', 'js'],

  // Optional: Collect code coverage from specific files
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],

  // Optional: Coverage output directory
  coverageDirectory: 'coverage',

  // Optional: Coverage threshold settings (fail tests if coverage is below thresholds)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Optional: Set up global test variables or mocks
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts',
    '**/src/api/v1/modules/**/__tests__/unit/**/*.spec.ts',
    '**/src/api/v1/modules/**/__tests__/unit/**/*.test.ts',
    '**/src/api/v1/modules/**/__tests__/e2e/**/*.spec.ts',
    '**/src/api/v1/modules/**/__tests__/e2e/**/*.test.ts',
  ],
};

export default config;
