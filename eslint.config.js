import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'public/',
      'scripts/',
    ],
  },

  ...eslintPluginAstro.configs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/missing-client-only-directive-value': 'error',
      'astro/no-set-html-directive': 'warn',
    },
  },

  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
  },
];