import { defineConfig } from 'astro/config';

const SITE_URL = 'https://senior-living-options.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    // sitemap temporarily disabled due to bug with trailingSlash
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  },
});
