module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.ts'],
  testTimeout: 30000,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/',
    '/tests/'
  ]
};