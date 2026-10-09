import type { CollectionEntry } from 'astro:content';

export interface SEOMeta {
  title: string;
  description: string;
  canonical: string;
  ogType: 'website' | 'article';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterCard: 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: Record<string, unknown> | null;
  robots: string;
}

const SITE_URL = import.meta.env.PUBLIC_SITE_URL || 'https://senior-living-options.pages.dev';
const SITE_NAME = import.meta.env.PUBLIC_SITE_NAME || 'Senior Living Options';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export function generateArticleJsonLd(entry: CollectionEntry<'entries'>): Record<string, unknown> {
  const { data } = entry;
  const url = `${SITE_URL}/article/${entry.id}/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.seoTitle || data.title,
    description: data.seoDescription || data.description,
    image: data.image ? `${SITE_URL}${data.image}` : DEFAULT_OG_IMAGE,
    datePublished: data.publishDate.toISOString(),
    dateModified: data.lastReviewed.toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateCategoryJsonLd(
  category: string,
  categoryLabel: string
): Record<string, unknown> {
  const url = `${SITE_URL}/category/${category}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryLabel} - ${SITE_NAME}`,
    description: `Articles and guides about ${categoryLabel.toLowerCase()} for older adults and their families.`,
    url,
    mainEntity: {
      '@type': 'ItemList',
      name: categoryLabel,
    },
  };
}

export function buildSEOMeta(entry: CollectionEntry<'entries'>, customOgImage?: string): SEOMeta {
  const { data } = entry;
  const url = `${SITE_URL}/article/${entry.id}/`;
  const ogImage = customOgImage || (data.image ? `${SITE_URL}${data.image}` : DEFAULT_OG_IMAGE);

  return {
    title: data.seoTitle || data.title,
    description: data.seoDescription || data.description,
    canonical: url,
    ogType: 'article',
    ogTitle: data.seoTitle || data.title,
    ogDescription: data.seoDescription || data.description,
    ogImage,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: data.seoTitle || data.title,
    twitterDescription: data.seoDescription || data.description,
    twitterImage: ogImage,
    jsonLd: generateArticleJsonLd(entry),
    robots: data.noIndex ? 'noindex,nofollow' : data.noFollow ? 'index,nofollow' : 'index,follow',
  };
}

export function buildCategorySEOMeta(
  category: string,
  categoryLabel: string,
  description: string
): SEOMeta {
  const url = `${SITE_URL}/category/${category}/`;
  return {
    title: `${categoryLabel} - Guides & Articles | ${SITE_NAME}`,
    description,
    canonical: url,
    ogType: 'website',
    ogTitle: `${categoryLabel} | ${SITE_NAME}`,
    ogDescription: description,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: `${categoryLabel} | ${SITE_NAME}`,
    twitterDescription: description,
    twitterImage: DEFAULT_OG_IMAGE,
    jsonLd: generateCategoryJsonLd(category, categoryLabel),
    robots: 'index,follow',
  };
}

export function buildHomeSEOMeta(): SEOMeta {
  return {
    title: `${SITE_NAME} - Complete Guides for Senior Living and Care Options`,
    description:
      'Find the best care option for your loved one. Expert guides on Assisted Living, Memory Care, Nursing Homes, In-Home Care, costs, and caregiver resources.',
    canonical: SITE_URL,
    ogType: 'website',
    ogTitle: SITE_NAME,
    ogDescription:
      'Complete guides for senior living and care options. Assisted Living, Memory Care, Nursing Homes, In-Home Care, costs, and caregiver resources.',
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: SITE_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: SITE_NAME,
    twitterDescription: 'Complete guides for senior living and care options.',
    twitterImage: DEFAULT_OG_IMAGE,
    jsonLd: generateWebSiteJsonLd(),
    robots: 'index,follow',
  };
}

export function buildSearchSEOMeta(query: string): SEOMeta {
  const url = `${SITE_URL}/search/?q=${encodeURIComponent(query)}`;
  return {
    title: `Search: "${query}" | ${SITE_NAME}`,
    description: `Search results for "${query}" on ${SITE_NAME}. Find articles about senior living and care options.`,
    canonical: url,
    ogType: 'website',
    ogTitle: `Search: "${query}" | ${SITE_NAME}`,
    ogDescription: `Search results for "${query}"`,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: `Search: "${query}" | ${SITE_NAME}`,
    twitterDescription: `Search results for "${query}"`,
    twitterImage: DEFAULT_OG_IMAGE,
    jsonLd: null,
    robots: 'noindex,follow',
  };
}

function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(?:39|x27);/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractFAQsFromHtml(html: string): Array<{ question: string; answer: string }> {
  const section = html.match(
    /<h2[^>]*>\s*Frequently Asked Questions\s*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i
  );
  if (!section) return [];

  const faqs: Array<{ question: string; answer: string }> = [];
  const itemRegex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3[\s>]|$)/g;
  let match;
  while ((match = itemRegex.exec(section[1])) !== null) {
    const question = htmlToText(match[1]);
    const answer = htmlToText(match[2]);
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

export function breadcrumbsToJsonLd(
  crumbs: Array<{ label: string; href?: string }>,
  pageUrl: string
): Record<string, unknown> {
  return generateBreadcrumbJsonLd(
    crumbs.map((c) => ({ name: c.label, url: c.href ? `${SITE_URL}${c.href}` : pageUrl }))
  );
}

export function combineJsonLd(
  ...items: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown> {
  const graph = items
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map((item) => {
      const { '@context': _context, ...rest } = item;
      return rest;
    });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function generateFAQPageJsonLd(
  faqs: Array<{ question: string; answer: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
