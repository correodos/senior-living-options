// Closed list of source domains allowed in new articles (checked by validate-draft).
// Rationale and who publishes each domain: .claude/skills/new-article/sources.md

export type SourceTier = 'official' | 'cost-survey' | 'reference' | 'context';

// Any *.gov host counts as official: .gov registration is restricted to U.S. government entities
// (federal, state, local), which also covers every state Medicaid agency.
const OFFICIAL_SUFFIX = '.gov';

const ALLOWED: Record<string, SourceTier> = {
  // Cost of care survey
  'carescout.com': 'cost-survey',
  'genworth.com': 'cost-survey',
  // Nonprofits, research and actuarial references
  'aarp.org': 'reference',
  'alz.org': 'reference',
  'parkinson.org': 'reference',
  'ahcancal.org': 'reference',
  'theconsumervoice.org': 'reference',
  'kff.org': 'reference',
  'nic.org': 'reference',
  'healthinaging.org': 'reference',
  'caregiver.org': 'reference',
  'ncoa.org': 'reference',
  'usaging.org': 'reference',
  'milliman.com': 'reference',
  // Context only: never the source of a key figure
  'aaltci.org': 'context',
  'hcaoa.org': 'context',
  'health.usnews.com': 'context',
  'seniorhousingnews.com': 'context',
  'politifact.com': 'context',
};

// Explicitly rejected: parked/impostor domains and referral sites paid by facilities.
export const BLOCKED: Record<string, string> = {
  'alzheimers.org': 'parked domain, not the Alzheimer\'s Association (use alz.org)',
  'aplaceformom.com': 'referral service paid by facilities',
  'seniorliving.org': 'lead-generation site',
  'payingforseniorcare.com': 'referral commissions',
  'caring.com': 'referral service paid by providers',
  'seniorly.com': 'referral service paid by facilities',
};

function matches(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

export function classifySource(url: string): { tier: SourceTier | 'blocked' | 'unknown'; reason?: string } {
  let host: string;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return { tier: 'unknown', reason: 'not HTTPS' };
    host = parsed.hostname.toLowerCase();
  } catch {
    return { tier: 'unknown', reason: 'invalid URL' };
  }

  for (const [domain, reason] of Object.entries(BLOCKED)) {
    if (matches(host, domain)) return { tier: 'blocked', reason };
  }
  if (host.endsWith(OFFICIAL_SUFFIX)) return { tier: 'official' };
  for (const [domain, tier] of Object.entries(ALLOWED)) {
    if (matches(host, domain)) return { tier };
  }
  return { tier: 'unknown', reason: `${host} is not in the allowlist` };
}
