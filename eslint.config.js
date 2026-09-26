export default [
  { ignores: ['dist/', 'node_modules/', '.astro/', 'public/', 'scripts/'] },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: await import('astro-eslint-parser'),
      parserOptions: {
        parser: await import('@typescript-eslint/parser'),
        extraFileExtensions: ['.astro'],
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      astro: await import('eslint-plugin-astro'),
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      ...(await import('eslint-plugin-astro')).configs.recommended.rules,
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/missing-client-only-directive-value': 'error',
      'astro/no-set-html-directive': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: await import('@typescript-eslint/parser'),
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
];