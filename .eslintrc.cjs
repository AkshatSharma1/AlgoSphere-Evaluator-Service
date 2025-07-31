// .eslintrc.cjs
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'simple-import-sort', 'security'],
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'airbnb-typescript/base', // Use this for non-React projects
    'plugin:@typescript-eslint/recommended',
    // 'plugin:security/recommended',
    'plugin:prettier/recommended', // Must be the last extension
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // This setting is required for rules that need type information
    project: './tsconfig.json',
  },
  env: {
    node: true, // Enables Node.js global variables
  },
  rules: {
    semi: ['error', 'always'],

    // -- Enforce sorted imports and exports
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // -- Relaxing some of Airbnb's stricter rules
    // Allows console.log for server-side logging
    'no-console': 'off',
    // Not all functions need to be class methods
    'class-methods-use-this': 'off',

    // -- TypeScript-specific overrides
    // Allows using "any" type, but consider enabling it for stricter typing
    '@typescript-eslint/no-explicit-any': 'off',

    // -- Import plugin rules
    'import/prefer-default-export': 'off', // Allows named exports
  },
};