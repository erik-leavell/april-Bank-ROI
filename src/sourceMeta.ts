import { ScenarioInputs } from './types';

export interface SourceInfo {
  source: string;
  detail: string;
}

export const SOURCE_META: Partial<Record<keyof ScenarioInputs, SourceInfo>> = {
  // Bank Profile
  totalCustomers: {
    source: 'Bank data',
    detail: 'Bank provides total active checking/savings customers from core banking.',
  },
  ftpCreditRate: {
    source: 'Bank treasury',
    detail: 'Funds Transfer Pricing rate — bank\'s internal deposit valuation from treasury desk.',
  },
  nim: {
    source: 'Public data',
    detail: 'US Bancorp 10-K/10-Q earnings releases; NIM reported quarterly. Use FTP if available.',
  },

  // Funnel
  engagementRate: {
    source: 'Estimate',
    detail: '% of customers engaging with tax feature. Industry benchmarks for embedded financial tools: 10–25%.',
  },
  completionRate: {
    source: 'Estimate',
    detail: '% of engaged users completing filing. TurboTax ~75%; embedded ~20–35% given lower intent.',
  },
  refundEligibility: {
    source: 'IRS',
    detail: 'IRS Statistics of Income — ~95% of individual filers receive a refund.',
  },
  existingDDPenetration: {
    source: 'Bank data',
    detail: '% of customers already on direct deposit. Bank provides from core banking system.',
  },

  // Deposit Value
  avgTaxRefund: {
    source: 'IRS',
    detail: 'IRS Data Book 2024 filing season — average individual refund ~$3,200.',
  },
  incrementalDepositRate: {
    source: 'JPMC Institute',
    detail: 'JPMorgan Chase Institute "Tax Time" studies — 15–25% of refund deposits retained at 6 months.',
  },
  refundEffDuration: {
    source: 'JPMC Institute',
    detail: 'Refund balances return to pre-refund levels within 2–5 months.',
  },

  // DD Switching
  ddSwitchRate: {
    source: 'Javelin / Fintech',
    detail: 'Javelin Strategy: 2–4% annual voluntary switching. With tax filing + incentives: 5–12% (Chime/SoFi benchmarks).',
  },
  avgAnnualPayroll: {
    source: 'BLS',
    detail: 'Bureau of Labor Statistics — median household income ~$70K (2024).',
  },
  adbForDD: {
    source: 'Bank data',
    detail: 'Average daily balance for DD customers. Bank provides from deposit analytics. Fallback: $8,400 (Fed SCF).',
  },
  y1PartialFactor: {
    source: 'Timing',
    detail: 'Tax season Jan–Apr; DD switches happen over remaining months. 0.65 = ~8 months of partial-year value.',
  },

  // RAL
  ralEligibility: {
    source: 'Industry data',
    detail: 'TurboTax/H&R Block RAL programs: 50–70% of filers qualify (sufficient refund + identity verification).',
  },
  ralTakeRate: {
    source: 'CFPB / Industry',
    detail: 'Among eligible filers, 20–35% opt for refund advance. Sources: CFPB RAL reports, H&R Block/Intuit disclosures.',
  },
  avgAdvance: {
    source: 'Industry data',
    detail: 'TurboTax Refund Advance: $500–$4,000 range. Industry average ~$1,500–$2,500.',
  },
  feeAPR: {
    source: 'Bank decision',
    detail: 'Modern RALs typically 0% APR (loss-leader). Bank may charge up to 5%. Revenue = fee income on advance.',
  },
  lossRate: {
    source: 'Lender data',
    detail: 'RAL losses 0.5–2.0% — advance secured by IRS refund (IRS pays bank directly). Very low risk.',
  },
  costOfCapital: {
    source: 'Bank treasury',
    detail: 'Bank\'s internal cost of funds for ~21-day average RAL hold period.',
  },

  // Premium Filing
  payingFilerRate: {
    source: 'Market data',
    detail: '% upgrading to paid tier. TurboTax ~60% paid; embedded: 8–15% (simpler returns, lower upgrade intent).',
  },
  avgRevPerFiling: {
    source: 'Market data',
    detail: 'TurboTax Deluxe $69, Premier $129; H&R Block $55–$115. Blended avg paid filer: $85–$200.',
  },
  bankRevShare: {
    source: 'Contract',
    detail: 'april–bank revenue share on premium filing revenue per partnership agreement.',
  },

  // Cross-sell
  crossSellEligibility: {
    source: 'McKinsey',
    detail: '40–60% of engaged customers meet credit/qualification criteria for additional products (McKinsey Banking Annual Review).',
  },
  crossSellConversion: {
    source: 'Industry data',
    detail: 'Contextual cross-sell conversion: 8–20% in-app. Industry avg digital banking cross-sell: 5–15%.',
  },
  avgProductRevenue: {
    source: 'Bank data',
    detail: 'Bank\'s avg annual revenue per new product sold (credit card, savings, personal loan).',
  },
  productProfitMargin: {
    source: 'Bank data',
    detail: 'Bank\'s profit margin on cross-sold products — varies by product type (35–50% typical).',
  },

  // Retention / LTV
  churnReduction: {
    source: 'ABA / Bain',
    detail: 'DD customers churn at ~half the rate of non-DD (ABA/Bain Retail Banking Loyalty survey). 1–5pp reduction.',
  },
  avgAnnualCustomerValue: {
    source: 'Bank data',
    detail: 'Bank\'s avg annual revenue per retail customer from internal analytics.',
  },
  baselineChurnRate: {
    source: 'Bank data',
    detail: 'Bank\'s current annual customer attrition rate from retention reporting.',
  },

  // Costs
  aprilPlatformFee: {
    source: 'Contract',
    detail: 'Annual platform licensing fee per april partnership agreement.',
  },
  aprilPerFilingFee: {
    source: 'Contract',
    detail: 'Per-filing transaction fee per april partnership agreement.',
  },
  bankMarketingPerEngaged: {
    source: 'Estimate',
    detail: 'Bank\'s cost to market tax feature — email, in-app notifications, branch materials.',
  },
  bankOpsCostPerYear: {
    source: 'Estimate',
    detail: 'Bank\'s internal ops — support staff, compliance oversight, program management.',
  },
  integrationAmortPerYear: {
    source: 'Estimate',
    detail: 'One-time integration cost amortized over 3 years (API integration, testing, launch).',
  },
  displacedRevenuePerYear: {
    source: 'Bank data',
    detail: 'Revenue from existing tax partnerships being replaced — bank provides if applicable.',
  },
  ralComplianceY1: {
    source: 'Estimate',
    detail: 'Higher Y1 for RAL program setup, compliance buildout, and initial underwriting.',
  },
  ralComplianceY2to5: {
    source: 'Estimate',
    detail: 'Ongoing annual compliance, monitoring, and regulatory reporting.',
  },

  // Growth
  yoyEngagementGrowth: {
    source: 'Estimate',
    detail: 'Compounds annually: Y2 rate = Y1 × (1 + growth%). E.g., 17.5% × 1.15 = 20.1% in Y2.',
  },
  yoyCompletionImprovement: {
    source: 'Estimate',
    detail: 'Linear add: Y2 rate = Y1 + pp. E.g., 27.5% + 2pp = 29.5% in Y2. Intentionally linear.',
  },
};
