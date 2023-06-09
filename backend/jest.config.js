/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.spec.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  transform: {},
  forceExit: true,
};

export default config;
