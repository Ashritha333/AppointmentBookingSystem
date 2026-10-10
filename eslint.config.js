const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['backend/**/*.js', 'tests/**/*.js', 'eslint.config.js'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.jest } },
    rules: { 'no-unused-vars': 'error', eqeqeq: 'error', 'no-console': 'warn' },
  },
  {
    files: ['frontend/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
];
