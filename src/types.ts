export type ScenarioKey = 'bear' | 'base' | 'bull';

export interface ScenarioInputs {
  // Bank Profile
  bankName: string;
  totalCustomers: number;
  ftpCreditRate: number;
  nim: number;
  useFTP: boolean;

  // Funnel
  engagementRate: number;
  completionRate: number;
  refundEligibility: number;
  existingDDPenetration: number;

  // Deposit Value
  avgTaxRefund: number;
  incrementalDepositRate: number;
  refundEffDuration: number;

  // DD Switching
  ddSwitchRate: number;
  avgAnnualPayroll: number;
  adbForDD: number;
  y1PartialFactor: number;

  // RAL
  ralEligibility: number;
  ralTakeRate: number;
  avgAdvance: number;
  feeAPR: number;
  lossRate: number;
  costOfCapital: number;

  // Premium Filing
  payingFilerRate: number;
  avgRevPerFiling: number;
  bankRevShare: number;

  // Cross-sell
  crossSellEligibility: number;
  crossSellConversion: number;
  avgProductRevenue: number;
  productProfitMargin: number;

  // Retention/LTV
  churnReduction: number;
  avgAnnualCustomerValue: number;
  baselineChurnRate: number;

  // Costs
  aprilPlatformFee: number;
  aprilPerFilingFee: number;
  bankMarketingPerEngaged: number;
  bankOpsCostPerYear: number;
  integrationAmortPerYear: number;
  displacedRevenuePerYear: number;
  ralComplianceY1: number;
  ralComplianceY2to5: number;

  // Growth
  yoyEngagementGrowth: number;
  yoyCompletionImprovement: number;
}

export interface YearlyFunnel {
  engagementRate: number;
  completionRate: number;
  engagedCustomers: number;
  completedFilers: number;
  refundEligible: number;
  newDDSwitchers: number;
  cumulativeDD: number;
}

export interface YearlyValueAreas {
  depositNII: number;
  ddSwitching: number;
  ral: number;
  premiumFiling: number;
  crossSell: number;
  retention: number;
  interchange: number;
  totalGross: number;
}

export interface YearlyCosts {
  platformFee: number;
  perFilingFee: number;
  bankMarketing: number;
  bankOps: number;
  integration: number;
  displacedRevenue: number;
  ralCompliance: number;
  totalCosts: number;
}

export interface YearlyResults {
  funnel: YearlyFunnel;
  valueAreas: YearlyValueAreas;
  costs: YearlyCosts;
  netROI: number;
  cumulativeNet: number;
}

export interface ScenarioResults {
  years: [YearlyResults, YearlyResults, YearlyResults, YearlyResults, YearlyResults];
  fiveYearNetROI: number;
  paybackMonths: number;
  y1ROIPct: number;
}

export interface AllInputs {
  bear: ScenarioInputs;
  base: ScenarioInputs;
  bull: ScenarioInputs;
}

export interface AllResults {
  bear: ScenarioResults;
  base: ScenarioResults;
  bull: ScenarioResults;
}
