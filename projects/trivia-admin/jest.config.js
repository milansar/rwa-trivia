const esModules = ['[thir-party-lib]'].join('|');

module.exports = {
  globals: {
    'ts-jest': {
      allowSyntheticDefaultImports: true,
    },
  },
  transformIgnorePatterns: [
    "node_modules/(?!@ngrx|angular2-ui-switch|ng-dynamic)"
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};