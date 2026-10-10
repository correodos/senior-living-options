import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isOfficialHost, medicaidFileSchema, type StateMedicaid } from '../src/utils/medicaid-schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const STALE_AFTER_DAYS = 365;
const FIELDS = [
  'incomeCapMonthly',
  'assetLimitSingle',
  'homeEquityLimit',
  'communitySpouseResourceMin',
  'avgPrivatePayRate',
] as const;

const errors: string[] = [];
const warnings: string[] = [];
const today = new Date();

const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'medicaid-by-state.json'), 'utf-8'));
const parsed = medicaidFileSchema.safeParse(raw);

if (!parsed.success) {
  parsed.error.issues.forEach((issue) => errors.push(`${issue.path.join('.')}: ${issue.message}`));
} else {
  const costs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'costs-by-state.json'), 'utf-8'));
  const expected = Object.keys(costs).filter((key) => !key.startsWith('_'));
  const states = Object.entries(parsed.data).filter(([key]) => key !== '_meta') as [
    string,
    StateMedicaid,
  ][];

  expected
    .filter((code) => !states.some(([key]) => key === code))
    .forEach((code) => errors.push(`${code}: missing from medicaid-by-state.json`));
  states
    .filter(([code]) => !expected.includes(code))
    .forEach(([code]) => errors.push(`${code}: unknown state code`));

  const ageInDays = (iso: string) => (today.getTime() - new Date(iso).getTime()) / 86400000;

  let verified = 0;
  let review = 0;
  const statesWithFacts: string[] = [];

  for (const [code, state] of states) {
    if (!isOfficialHost(state.agency.url)) {
      errors.push(`${code}: agency URL is not on an official .gov/.us domain (${state.agency.url})`);
    }
    if (new Date(state.agency.checkedOn) > today) errors.push(`${code}: agency checkedOn is in the future`);
    if (ageInDays(state.agency.checkedOn) > STALE_AFTER_DAYS) {
      warnings.push(`${code}: agency link last checked ${state.agency.checkedOn} (over a year ago)`);
    }

    let hasVerifiedFact = false;
    for (const field of FIELDS) {
      const entry = state[field];
      if (!entry) continue;
      if (entry.status === 'verified') {
        verified++;
        hasVerifiedFact = true;
        if (!isOfficialHost(entry.source)) {
          errors.push(`${code}.${field}: verified value must cite an official .gov/.us source (${entry.source})`);
        }
      } else {
        review++;
        warnings.push(`${code}.${field}: needs review before it can be shown (${entry.note ?? 'no note'})`);
      }
      if (new Date(entry.checkedOn) > today) errors.push(`${code}.${field}: checkedOn is in the future`);
      if (entry.effective && entry.effective > entry.checkedOn) {
        errors.push(`${code}.${field}: effective date is after checkedOn`);
      }
      if (ageInDays(entry.checkedOn) > STALE_AFTER_DAYS) {
        warnings.push(`${code}.${field}: last checked ${entry.checkedOn} (over a year ago), re-verify`);
      }
    }
    if (hasVerifiedFact) statesWithFacts.push(code);
  }

  console.log(`States: ${states.length} | agencies with link: ${states.length}`);
  console.log(`Verified facts: ${verified} | needing review: ${review}`);
  console.log(`States showing at least one verified fact: ${statesWithFacts.join(', ') || 'none'}`);
}

warnings.forEach((message) => console.log(`  ⚠️  ${message}`));
if (errors.length > 0) {
  errors.forEach((message) => console.error(`  ❌ ${message}`));
  console.error(`\nMedicaid data validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log('\n✅ Medicaid data validation passed');
