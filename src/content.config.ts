import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { entrySchema } from './utils/entry-schema';

export const collections = {
  entries: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/entries' }),
    schema: entrySchema,
  }),
};
