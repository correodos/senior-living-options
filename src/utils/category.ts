export interface CategoryInfo {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionShort: string;
  color: string;
  bgColor: string;
  icon: string;
  pillarSlug?: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  'assisted-living': {
    slug: 'assisted-living',
    label: 'Assisted Living',
    labelEn: 'Assisted Living',
    description:
      'Residential communities combining housing, support services, and personalized care for older adults who need help with daily activities but do not require constant medical attention.',
    descriptionShort:
      'Housing + support services for daily activities. No constant medical care needed.',
    color: 'var(--sl-color-al-text)',
    bgColor: 'var(--sl-color-al-bg)',
    icon: '🏠',
    pillarSlug: 'assisted-living-complete-guide', // ACTUAL
  },
  'memory-care': {
    slug: 'memory-care',
    label: 'Memory Care',
    labelEn: 'Memory Care',
    description:
      "Specialized units within assisted living or nursing home communities, designed specifically for people with Alzheimer's, dementia, or other memory disorders.",
    descriptionShort: "Specialized care for Alzheimer's and dementia in secure environments.",
    color: 'var(--sl-color-mc-text)',
    bgColor: 'var(--sl-color-mc-bg)',
    icon: '🧠',
    pillarSlug: 'complete-guide-memory-care', // PENDIENTE: definir slug real
  },
  'nursing-homes': {
    slug: 'nursing-homes',
    label: 'Nursing Homes',
    labelEn: 'Nursing Homes',
    description:
      'Facilities providing 24/7 skilled nursing care, rehabilitation, and medical care for older adults with complex health conditions.',
    descriptionShort: '24/7 skilled nursing and medical care for complex health conditions.',
    color: 'var(--sl-color-nh-text)',
    bgColor: 'var(--sl-color-nh-bg)',
    icon: '🏥',
    pillarSlug: 'complete-guide-nursing-homes', // PENDIENTE: definir slug real
  },
  'in-home-care': {
    slug: 'in-home-care',
    label: 'In-Home Care',
    labelEn: 'In-Home Care',
    description:
      "Personal care, companionship, and medical assistance services provided in the older adult's home, allowing them to age in place.",
    descriptionShort: 'Care services at home so seniors can age in place comfortably.',
    color: 'var(--sl-color-ihc-text)',
    bgColor: 'var(--sl-color-ihc-bg)',
    icon: '🏡',
    pillarSlug: 'complete-guide-in-home-care', // PENDIENTE: definir slug real
  },
  'senior-care-costs': {
    slug: 'senior-care-costs',
    label: 'Costs & Finance',
    labelEn: 'Costs & Finance',
    description:
      'Detailed information on senior care costs by state, financing options, Medicare, Medicaid, long-term care insurance, and veterans benefits.',
    descriptionShort: 'State-by-state costs, payment options, Medicare, Medicaid, VA benefits.',
    color: 'var(--sl-color-cf-text)',
    bgColor: 'var(--sl-color-cf-bg)',
    icon: '💰',
    pillarSlug: 'complete-guide-senior-care-costs', // PENDIENTE: definir slug real
  },
  'caregiver-resources': {
    slug: 'caregiver-resources',
    label: 'Caregiver Help',
    labelEn: 'Caregiver Help',
    description:
      'Resources, guides, and support for family caregivers: burnout prevention, daily care checklists, respite resources, legal and financial aspects.',
    descriptionShort:
      'Burnout prevention, daily checklists, respite care, legal & financial guides.',
    color: 'var(--sl-color-cr-text)',
    bgColor: 'var(--sl-color-cr-bg)',
    icon: '🤝',
    pillarSlug: 'complete-guide-caregiver-resources', // PENDIENTE: definir slug real
  },
} as const;

export type CategorySlug = keyof typeof CATEGORIES;

export function getCategoryInfo(slug: string): CategoryInfo | null {
  return CATEGORIES[slug as CategorySlug] || null;
}

export function getAllCategories(): CategoryInfo[] {
  return Object.values(CATEGORIES);
}

export function getCategoryColor(slug: string): string {
  return CATEGORIES[slug as CategorySlug]?.color || 'var(--sl-color-primary)';
}

export function getCategoryLabel(slug: string): string {
  return CATEGORIES[slug as CategorySlug]?.label || slug;
}

export function getCategoryPillarSlug(slug: string): string | undefined {
  return CATEGORIES[slug as CategorySlug]?.pillarSlug;
}

export function getCategoryIcon(slug: string): string {
  return CATEGORIES[slug as CategorySlug]?.icon || '📄';
}

export function getCategoryBgColor(slug: string): string {
  return CATEGORIES[slug as CategorySlug]?.bgColor || 'var(--sl-color-primary-light)';
}

export function getCategoryDescriptionShort(slug: string): string {
  return CATEGORIES[slug as CategorySlug]?.descriptionShort || '';
}
