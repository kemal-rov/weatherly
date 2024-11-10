module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Maps imports to resolve .js extensions to TypeScript .ts files during testing.
  },
  extensionsToTreatAsEsm: ['.ts'],
};
