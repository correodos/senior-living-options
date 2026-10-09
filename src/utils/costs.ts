import raw from '../data/costs-by-state.json';

export interface StateCosts {
  name: string;
  assistedLiving: number;
  assistedLivingAnnual: number;
  nursingHomeSemi: number;
  nursingHomeSemiAnnual: number;
  nursingHomePrivate: number | null;
  nursingHomePrivateAnnual: number | null;
  inHomeCare: number;
  inHomeCareAnnual: number;
  inHomeCareHourly: number;
  adultDayMonthly: number | null;
  adultDayAnnual: number | null;
  adultDayDaily: number | null;
  privateDutyNurseHourly: number | null;
}

export type StateRecord = StateCosts & { code: string };
export type MonthlyKey =
  'assistedLiving' | 'nursingHomeSemi' | 'nursingHomePrivate' | 'inHomeCare' | 'adultDayMonthly';

interface National {
  assistedLiving: { monthly: number; annual: number };
  nursingHomeSemi: { monthly: number; annual: number; daily: number };
  nursingHomePrivate: { monthly: number; annual: number; daily: number };
  inHomeCare: { monthly: number; annual: number; hourly: number };
  adultDay: { monthly: number; annual: number; daily: number };
  privateDutyNurse: { hourly: number };
}

interface Meta {
  source: string;
  url: string;
  dataCollection: string;
  published: string;
  publishedDate: string;
  surveyYear: number;
  notes: string;
}

const data = raw as unknown as Record<string, unknown>;

export const meta = data._meta as Meta;
export const national = data._national as National;
export const SURVEY_YEAR = meta.surveyYear;

export const states: StateRecord[] = Object.entries(data)
  .filter(([code]) => !code.startsWith('_'))
  .map(([code, record]) => ({ code, ...(record as StateCosts) }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const MONTHLY_LABELS: Record<MonthlyKey, string> = {
  assistedLiving: 'Assisted living',
  nursingHomeSemi: 'Nursing home (semi-private)',
  nursingHomePrivate: 'Nursing home (private)',
  inHomeCare: 'In-home care (non-medical)',
  adultDayMonthly: 'Adult day health care',
};

const NATIONAL_MONTHLY: Record<MonthlyKey, number> = {
  assistedLiving: national.assistedLiving.monthly,
  nursingHomeSemi: national.nursingHomeSemi.monthly,
  nursingHomePrivate: national.nursingHomePrivate.monthly,
  inHomeCare: national.inHomeCare.monthly,
  adultDayMonthly: national.adultDay.monthly,
};

export function nationalMonthly(key: MonthlyKey): number {
  return NATIONAL_MONTHLY[key];
}

export function fmtUsd(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function pctVsNational(value: number | null, key: MonthlyKey): number | null {
  if (value === null) return null;
  return Math.round(((value - NATIONAL_MONTHLY[key]) / NATIONAL_MONTHLY[key]) * 100);
}

export function pctLabel(value: number | null, key: MonthlyKey): string {
  const pct = pctVsNational(value, key);
  if (pct === null) return 'Not enough data';
  if (pct === 0) return 'Same as national median';
  return pct > 0 ? `+${pct}% vs national` : `${pct}% vs national`;
}

function pctPhrase(value: number | null, key: MonthlyKey): string {
  const pct = pctVsNational(value, key);
  if (pct === null || pct === 0) return 'in line with';
  return `${Math.abs(pct)}% ${pct > 0 ? 'above' : 'below'}`;
}

function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th'}`;
}

function ranked(key: MonthlyKey): StateRecord[] {
  return states
    .filter((s) => s[key] !== null)
    .sort((a, b) => (b[key] as number) - (a[key] as number));
}

export function rankOf(code: string, key: MonthlyKey): { rank: number; total: number } | null {
  const list = ranked(key);
  const index = list.findIndex((s) => s.code === code);
  return index === -1 ? null : { rank: index + 1, total: list.length };
}

export function rankLabel(code: string, key: MonthlyKey): string {
  const result = rankOf(code, key);
  if (!result) return 'No state ranking (insufficient data)';
  if (result.rank === 1) return `Most expensive of ${result.total} states`;
  if (result.rank === result.total) return `Least expensive of ${result.total} states`;
  return `${ordinal(result.rank)} most expensive of ${result.total} states`;
}

export function extremes(key: MonthlyKey): { highest: StateRecord; lowest: StateRecord } {
  const list = ranked(key);
  return { highest: list[0], lowest: list[list.length - 1] };
}

export function topStates(key: MonthlyKey, count: number, direction: 'highest' | 'lowest') {
  const list = ranked(key);
  return direction === 'highest' ? list.slice(0, count) : list.slice(-count).reverse();
}

export function similarStates(code: string, count = 4): StateRecord[] {
  const base = states.find((s) => s.code === code);
  if (!base) return [];
  const keys: MonthlyKey[] = ['assistedLiving', 'nursingHomeSemi', 'inHomeCare'];
  const distance = (other: StateRecord) =>
    keys.reduce((sum, key) => {
      const diff = ((other[key] as number) - (base[key] as number)) / (base[key] as number);
      return sum + diff * diff;
    }, 0);
  return states
    .filter((s) => s.code !== code)
    .sort((a, b) => distance(a) - distance(b))
    .slice(0, count);
}

export function twoYearCosts(state: StateRecord): Array<{ label: string; total: number | null }> {
  const times24 = (value: number | null) => (value === null ? null : value * 24);
  return [
    { label: 'Assisted living', total: times24(state.assistedLiving) },
    { label: 'Nursing home (semi-private)', total: times24(state.nursingHomeSemi) },
    { label: 'Nursing home (private)', total: times24(state.nursingHomePrivate) },
    { label: 'In-home care (44 hours a week)', total: times24(state.inHomeCare) },
  ];
}

export function stateSummary(state: StateRecord): string {
  const al = rankOf(state.code, 'assistedLiving');
  const parts = [
    `In ${state.name}, the median cost of assisted living is ${fmtUsd(state.assistedLiving)} per month, ${pctPhrase(state.assistedLiving, 'assistedLiving')} the U.S. median of ${fmtUsd(national.assistedLiving.monthly)}.`,
    `A semi-private nursing home room has a median of ${fmtUsd(state.nursingHomeSemi)} per month, and non-medical in-home care averages ${fmtUsd(state.inHomeCareHourly)} per hour, or ${fmtUsd(state.inHomeCare)} per month at 44 hours a week.`,
  ];
  if (al) {
    parts.push(
      `For assisted living, ${state.name} ranks ${ordinal(al.rank)} highest among ${al.total} states.`
    );
  }
  return parts.join(' ');
}

export function stateFaqs(state: StateRecord): Array<{ question: string; answer: string }> {
  const privateNursing =
    state.nursingHomePrivate === null
      ? `CareScout did not have enough data to report a private-room median for ${state.name}.`
      : `A private room has a median of ${fmtUsd(state.nursingHomePrivate)} per month (${fmtUsd(state.nursingHomePrivateAnnual)} per year).`;
  const adultDay =
    state.adultDayDaily === null
      ? ''
      : ` Adult day health care has a median of ${fmtUsd(state.adultDayDaily)} per day, or ${fmtUsd(state.adultDayAnnual)} per year at five days a week.`;

  const keys: MonthlyKey[] = [
    'assistedLiving',
    'nursingHomeSemi',
    'nursingHomePrivate',
    'inHomeCare',
  ];
  const above = keys.filter((key) => (pctVsNational(state[key], key) ?? 0) > 0).length;
  const known = keys.filter((key) => state[key] !== null).length;

  return [
    {
      question: `How much does assisted living cost in ${state.name}?`,
      answer: `The median cost of assisted living in ${state.name} is ${fmtUsd(state.assistedLiving)} per month (${fmtUsd(state.assistedLivingAnnual)} per year) for a private one-bedroom unit, according to the ${SURVEY_YEAR} CareScout Cost of Care Survey. That is ${pctPhrase(state.assistedLiving, 'assistedLiving')} the U.S. median of ${fmtUsd(national.assistedLiving.monthly)} per month.`,
    },
    {
      question: `How much does a nursing home cost in ${state.name}?`,
      answer: `A semi-private nursing home room in ${state.name} has a median cost of ${fmtUsd(state.nursingHomeSemi)} per month (${fmtUsd(state.nursingHomeSemiAnnual)} per year), compared with ${fmtUsd(national.nursingHomeSemi.monthly)} nationally. ${privateNursing}`,
    },
    {
      question: `How much does in-home care cost in ${state.name}?`,
      answer: `Non-medical in-home care in ${state.name} has a median rate of ${fmtUsd(state.inHomeCareHourly)} per hour, which comes to ${fmtUsd(state.inHomeCare)} per month (${fmtUsd(state.inHomeCareAnnual)} per year) at 44 hours of care a week. The U.S. median is ${fmtUsd(national.inHomeCare.hourly)} per hour.${adultDay}`,
    },
    {
      question: `Is senior care in ${state.name} more expensive than the national average?`,
      answer: `${state.name} is above the U.S. median for ${above} of the ${known} care types with ${SURVEY_YEAR} data (assisted living, nursing home semi-private and private rooms, and in-home care). Costs also vary widely by city and county within a state, so use these figures as a starting point.`,
    },
  ];
}
