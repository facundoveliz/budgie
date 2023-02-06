module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  root: true,
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'plugin:@next/next/recommended',
    'plugin:import/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
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
    // In some files I use styled-components directly in the
    // file, the best place to put it is in the end of the file,
    // and this error conflicts with that.
    '@typescript-eslint/no-use-before-define': [0],
    // Disable error jsx not allowed in tsx
    'react/jsx-filename-extension': [0],
    // Disable extensions in imports because ts conflict
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
