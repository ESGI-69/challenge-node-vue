/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.spec.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {
    '^.+\\.js$': 'babel-jest', // For ES6 support
  },
  forceExit: true,
};

export default config;
