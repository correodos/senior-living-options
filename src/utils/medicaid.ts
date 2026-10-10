import raw from '../data/medicaid-by-state.json';
import { fmtUsd } from './costs';
import type { StateMedicaid } from './medicaid-schema';

export interface MedicaidFact {
  label: string;
  value: string;
  source: string;
  sourceHost: string;
  detail: string;
}

const records = raw as unknown as Record<string, StateMedicaid>;

const FACTS: Array<{ key: keyof StateMedicaid; label: string }> = [
  { key: 'incomeCapMonthly', label: 'Monthly income limit for nursing home Medicaid' },
  { key: 'assetLimitSingle', label: 'Countable asset limit (single applicant)' },
  { key: 'homeEquityLimit', label: 'Home equity limit' },
  { key: 'communitySpouseResourceMin', label: 'Minimum assets the at-home spouse may keep' },
  {
    key: 'avgPrivatePayRate',
    label: 'Average private-pay nursing home rate used for transfer penalties',
  },
];

export function formatIsoDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function getMedicaidInfo(code: string) {
  const state = records[code];
  if (!state) return null;

  const facts: MedicaidFact[] = [];
  for (const { key, label } of FACTS) {
    const entry = state[key] as
      | {
          value: number;
          unit?: 'daily' | 'monthly';
          source: string;
          effective: string | null;
          checkedOn: string;
          status: string;
          method: string;
        }
      | undefined;
    if (!entry || entry.status !== 'verified' || entry.method !== 'read') continue;
    const suffix =
      key === 'incomeCapMonthly'
        ? '/month'
        : entry.unit
          ? `/${entry.unit === 'daily' ? 'day' : 'month'}`
          : '';
    facts.push({
      label,
      value: `${fmtUsd(entry.value)}${suffix}`,
      source: entry.source,
      sourceHost: new URL(entry.source).hostname,
      detail: `${entry.effective ? ` · effective ${formatIsoDate(entry.effective)}` : ''} · verified ${formatIsoDate(entry.checkedOn)}`,
    });
  }

  return { agency: state.agency, facts, notes: state.readerNotes ?? [] };
}
