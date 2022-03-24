module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:@next/next/recommended',
    "plugin:import/recommended"
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // disable error jsx not allowed in tsx
    'react/jsx-filename-extension': [0],
    // disable extensions in imports because ts conflict
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
  },
};
