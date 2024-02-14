module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    testMatch: ['**/*.test.js'],
    coverageReporters: ['json', 'lcov', 'text', 'html'],
    coverageDirectory: 'coverage',
  };
  