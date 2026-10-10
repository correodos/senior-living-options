import { z } from 'astro/zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD');
const httpsUrl = z.url().refine((url) => url.startsWith('https://'), 'must be an https URL');

const provenance = {
  source: httpsUrl,
  effective: isoDate.nullable(),
  checkedOn: isoDate,
  status: z.enum(['verified', 'review']),
  method: z.enum(['read', 'search-excerpt']),
  note: z.string().optional(),
};

function ensureVerifiedWasRead(
  field: { status: string; method: string },
  context: z.core.$RefinementCtx
) {
  if (field.status === 'verified' && field.method !== 'read') {
    context.addIssue({
      code: 'custom',
      message: 'status "verified" requires method "read" (value read from the official source)',
    });
  }
}

function amountField(min: number, max: number) {
  return z
    .object({ value: z.number().min(min).max(max), ...provenance })
    .superRefine(ensureVerifiedWasRead);
}

const rateField = z
  .object({
    value: z.number().positive(),
    unit: z.enum(['daily', 'monthly']),
    ...provenance,
  })
  .superRefine(ensureVerifiedWasRead)
  .superRefine((field, context) => {
    const [min, max] = field.unit === 'daily' ? [100, 1000] : [3000, 30000];
    if (field.value < min || field.value > max) {
      context.addIssue({
        code: 'custom',
        message: `${field.unit} rate ${field.value} is outside the plausible range ${min}-${max}`,
      });
    }
  });

export const FEDERAL_INCOME_CAP_2026 = 2982;

// Official state agency domains that do not end in .gov or .us.
// Florida's Department of Children and Families runs Medicaid eligibility on myflfamilies.com.
export const OFFICIAL_NON_GOV_DOMAINS = ['myflfamilies.com'];

export function isOfficialHost(url: string): boolean {
  const host = new URL(url).hostname;
  return (
    host.endsWith('.gov') ||
    host.endsWith('.us') ||
    OFFICIAL_NON_GOV_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`))
  );
}

export const stateMedicaidSchema = z.object({
  name: z.string().min(2),
  agency: z.object({
    name: z.string().min(5),
    url: httpsUrl,
    verifiedBy: z.enum(['http', 'search-index']),
    checkedOn: isoDate,
  }),
  incomeCapMonthly: amountField(500, FEDERAL_INCOME_CAP_2026).optional(),
  assetLimitSingle: amountField(1000, 500000).optional(),
  homeEquityLimit: amountField(500000, 2000000).optional(),
  communitySpouseResourceMin: amountField(10000, 200000).optional(),
  avgPrivatePayRate: rateField.optional(),
  // Reader-facing caveats shown on the state page (for example figures we could not confirm).
  readerNotes: z.array(z.string().min(20)).optional(),
});

export const medicaidFileSchema = z
  .object({ _meta: z.looseObject({ schemaVersion: z.number(), lastFullReview: isoDate }) })
  .catchall(stateMedicaidSchema);

export type StateMedicaid = z.infer<typeof stateMedicaidSchema>;
