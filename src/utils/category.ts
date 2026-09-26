export interface CategoryInfo {
  slug: string;
  label: string;
  labelEn: string;
  description: string;
  color: string;
  icon: string;
  pillarSlug?: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  'assisted-living': {
    slug: 'assisted-living',
    label: 'Assisted Living',
    labelEn: 'Assisted Living',
    description:
      'Comunidades residenciales que combinan vivienda, servicios de apoyo y atención personalizada para adultos mayores que necesitan ayuda con actividades diarias pero no requieren atención médica constante.',
    color: 'var(--sl-color-al)',
    icon: '🏠',
    pillarSlug: 'guia-completa-assisted-living',
  },
  'memory-care': {
    slug: 'memory-care',
    label: 'Memory Care',
    labelEn: 'Memory Care',
    description:
      'Unidades especializadas dentro de comunidades de assisted living o nursing homes, diseñadas específicamente para personas con Alzheimer, demencia u otros trastornos de memoria.',
    color: 'var(--sl-color-mc)',
    icon: '🧠',
    pillarSlug: 'guia-completa-memory-care',
  },
  'nursing-homes': {
    slug: 'nursing-homes',
    label: 'Nursing Homes',
    labelEn: 'Nursing Homes',
    description:
      'Instalaciones que proporcionan atención de enfermería especializada 24/7, rehabilitación y cuidado médico para adultos mayores con condiciones de salud complejas.',
    color: 'var(--sl-color-nh)',
    icon: '🏥',
    pillarSlug: 'guia-completa-nursing-homes',
  },
  'in-home-care': {
    slug: 'in-home-care',
    label: 'In-Home Care',
    labelEn: 'In-Home Care',
    description:
      'Servicios de cuidado personal, compañía y asistencia médica proporcionados en el hogar del adulto mayor, permitiéndole envejecer en su propia casa.',
    color: 'var(--sl-color-ihc)',
    icon: '🏡',
    pillarSlug: 'guia-completa-in-home-care',
  },
  'senior-care-costs': {
    slug: 'senior-care-costs',
    label: 'Costs & Finance',
    labelEn: 'Costs & Finance',
    description:
      'Información detallada sobre costos de cuidado de adultos mayores por estado, opciones de financiamiento, Medicare, Medicaid, seguros de cuidado a largo plazo y beneficios para veteranos.',
    color: 'var(--sl-color-cf)',
    icon: '💰',
    pillarSlug: 'costos-cuidado-mayores-por-estado',
  },
  'caregiver-resources': {
    slug: 'caregiver-resources',
    label: 'Caregiver Help',
    labelEn: 'Caregiver Help',
    description:
      'Recursos, guías y apoyo para cuidadores familiares: prevención de burnout, checklist de cuidado diario, recursos de respiro, aspectos legales y financieros.',
    color: 'var(--sl-color-cr)',
    icon: '🤝',
    pillarSlug: 'guia-completa-cuidadores',
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
