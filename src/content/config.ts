import { z, defineCollection } from 'astro:content';

const entrySchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(50).max(300),
  publishDate: z.date(),
  lastReviewed: z.date(),
  sources: z.array(z.string().url()).optional(),
  readingTime: z.number().int().positive().optional(),
  isPillar: z.boolean().default(false),
  category: z.enum([
    'assisted-living',
    'memory-care',
    'nursing-homes',
    'in-home-care',
    'senior-care-costs',
    'caregiver-resources',
  ]),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  canonicalUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  states: z.array(z.string()).optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  showTableOfContents: z.boolean().default(true),
  relatedArticles: z.array(z.string()).optional(),
});

export const collections = {
  entries: defineCollection({
    type: 'content',
    schema: entrySchema,
  }),
};
