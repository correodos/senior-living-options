export default {
  plugins: ['prettier-plugin-astro'],
  parser: 'astro',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.astro'],
      options: {
        parser: 'astro',
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        parser: 'markdown',
        proseWrap: 'always',
      },
    },
    {
      files: ['*.css'],
      options: {
        parser: 'css',
      },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        parser: 'json',
      },
    },
  ],
};