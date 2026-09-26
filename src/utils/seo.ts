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
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.webp`;

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
    description: `Guías y artículos sobre ${categoryLabel.toLowerCase()} para adultos mayores y sus familias.`,
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
    robots: data.noIndex ? 'noindex,nofollow' : 'index,follow',
  };
}

export function buildCategorySEOMeta(
  category: string,
  categoryLabel: string,
  description: string
): SEOMeta {
  const url = `${SITE_URL}/category/${category}/`;
  return {
    title: `${categoryLabel} - Guías y Artículos | ${SITE_NAME}`,
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
    title: `${SITE_NAME} - Guías Completas para Opciones de Vivienda y Cuidado de Adultos Mayores`,
    description:
      'Encuentra la mejor opción de vivienda y cuidado para tu ser querido. Guías expertas sobre Assisted Living, Memory Care, Nursing Homes, In-Home Care, costos y recursos para cuidadores.',
    canonical: SITE_URL,
    ogType: 'website',
    ogTitle: SITE_NAME,
    ogDescription:
      'Guías completas para opciones de vivienda y cuidado de adultos mayores. Assisted Living, Memory Care, Nursing Homes, In-Home Care, costos y recursos para cuidadores.',
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: SITE_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: SITE_NAME,
    twitterDescription: 'Guías completas para opciones de vivienda y cuidado de adultos mayores.',
    twitterImage: DEFAULT_OG_IMAGE,
    jsonLd: generateWebSiteJsonLd(),
    robots: 'index,follow',
  };
}

export function buildSearchSEOMeta(query: string): SEOMeta {
  const url = `${SITE_URL}/search/?q=${encodeURIComponent(query)}`;
  return {
    title: `Buscar: "${query}" | ${SITE_NAME}`,
    description: `Resultados de búsqueda para "${query}" en ${SITE_NAME}. Encuentra artículos sobre opciones de vivienda y cuidado para adultos mayores.`,
    canonical: url,
    ogType: 'website',
    ogTitle: `Buscar: "${query}" | ${SITE_NAME}`,
    ogDescription: `Resultados de búsqueda para "${query}"`,
    ogImage: DEFAULT_OG_IMAGE,
    ogUrl: url,
    twitterCard: 'summary_large_image',
    twitterTitle: `Buscar: "${query}" | ${SITE_NAME}`,
    twitterDescription: `Resultados de búsqueda para "${query}"`,
    twitterImage: DEFAULT_OG_IMAGE,
    jsonLd: null,
    robots: 'noindex,follow',
  };
}
