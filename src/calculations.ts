import { ScenarioInputs, YearlyResults, ScenarioResults, CohortLTV } from './types';

export function calculateScenario(inputs: ScenarioInputs): ScenarioResults {
  const nimRate = inputs.useFTP ? inputs.ftpCreditRate : inputs.nim;
  const years: YearlyResults[] = [];

  for (let y = 0; y < 5; y++) {
    // FUNNEL
    const engRate =
      y === 0
        ? inputs.engagementRate
        : years[y - 1].funnel.engagementRate * (1 + inputs.yoyEngagementGrowth);

    const compRate =
      y === 0
        ? inputs.completionRate
        : years[y - 1].funnel.completionRate + inputs.yoyCompletionImprovement;

    const engagedCustomers = inputs.totalCustomers * engRate;
    const completedFilers = engagedCustomers * compRate;
    const refundEligible = completedFilers * inputs.refundEligibility;

    const newDDSwitchers =
      completedFilers * (1 - inputs.existingDDPenetration) * inputs.ddSwitchRate;
    const cumulativeDD =
      y === 0 ? newDDSwitchers : years[y - 1].funnel.cumulativeDD + newDDSwitchers;

    // VALUE AREAS
    // VA1: Deposit NII
    const depositNII =
      refundEligible *
      0.98 *
      inputs.avgTaxRefund *
      inputs.incrementalDepositRate *
      nimRate *
      inputs.refundEffDuration;

    // VA2: DD Switching
    const ddSwitching =
      y === 0
        ? newDDSwitchers * inputs.adbForDD * nimRate * inputs.y1PartialFactor
        : cumulativeDD * inputs.adbForDD * nimRate;

    // VA3: RAL
    const ralValue =
      completedFilers *
      inputs.ralEligibility *
      inputs.ralTakeRate *
      inputs.avgAdvance *
      (inputs.feeAPR - inputs.lossRate);

    // VA4: Premium Filing
    const premFiling =
      completedFilers *
      inputs.payingFilerRate *
      inputs.avgRevPerFiling *
      inputs.bankRevShare;

    // VA5: Cross-sell
    const crossSell =
      engagedCustomers *
      inputs.crossSellEligibility *
      inputs.crossSellConversion *
      inputs.avgProductRevenue *
      inputs.productProfitMargin;

    // VA6: Retention (compounds)
    const retentionNew = engagedCustomers * inputs.churnReduction * inputs.avgAnnualCustomerValue;
    const retention = y === 0 ? retentionNew : years[y - 1].valueAreas.retention + retentionNew;

    // VA7: Interchange (compounds via cumulative DD)
    const interchange =
      y === 0
        ? cumulativeDD * 15 * 12 * 0.22 * inputs.y1PartialFactor
        : cumulativeDD * 15 * 12 * 0.22;

    const totalGross =
      depositNII + ddSwitching + ralValue + premFiling + crossSell + retention + interchange;

    // COSTS
    const platformFee = inputs.aprilPlatformFee;
    const perFilingFee = completedFilers * inputs.aprilPerFilingFee;
    const bankMarketing = engagedCustomers * inputs.bankMarketingPerEngaged;
    const bankOps =
      y === 0 ? inputs.bankOpsCostPerYear : years[y - 1].costs.bankOps * 1.05;
    const integration = y < 3 ? inputs.integrationAmortPerYear : 0;
    const displacedRevenue = inputs.displacedRevenuePerYear;
    const ralCompliance = y === 0 ? inputs.ralComplianceY1 : inputs.ralComplianceY2to5;

    const totalCosts =
      platformFee +
      perFilingFee +
      bankMarketing +
      bankOps +
      integration +
      displacedRevenue +
      ralCompliance;

    const netROI = totalGross - totalCosts;
    const cumulativeNet = y === 0 ? netROI : years[y - 1].cumulativeNet + netROI;

    years.push({
      funnel: {
        engagementRate: engRate,
        completionRate: compRate,
        engagedCustomers,
        completedFilers,
        refundEligible,
        newDDSwitchers,
        cumulativeDD,
      },
      valueAreas: {
        depositNII,
        ddSwitching,
        ral: ralValue,
        premiumFiling: premFiling,
        crossSell,
        retention,
        interchange,
        totalGross,
      },
      costs: {
        platformFee,
        perFilingFee,
        bankMarketing,
        bankOps,
        integration,
        displacedRevenue,
        ralCompliance,
        totalCosts,
      },
      netROI,
      cumulativeNet,
    });
  }

  const y1 = years[0];
  const fiveYearNetROI = years[4].cumulativeNet;
  const paybackMonths =
    y1.valueAreas.totalGross > 0
      ? (y1.costs.totalCosts / y1.valueAreas.totalGross) * 12
      : Infinity;
  const y1ROIPct =
    y1.costs.totalCosts !== 0
      ? y1.netROI / Math.abs(y1.costs.totalCosts)
      : 0;

  // COHORT LTV — Y1 cohort value across 5 calendar years
  // DD Switching, Retention, Interchange: flat at Y1 (same people, no new additions from cohort)
  // Deposit NII, RAL, Premium Filing, Cross-sell: grow with Tab 3 Value Areas rates
  const cohortLTVYears = years.map((yr, y) => {
    const ddSwitching = years[0].valueAreas.ddSwitching;      // flat — same DD customers
    const retention = years[0].valueAreas.retention;           // flat — same retained customers
    const interchange = years[0].valueAreas.interchange;       // flat — same DD customers transacting
    const depositNII = yr.valueAreas.depositNII;               // grows with funnel/rate changes
    const ral = yr.valueAreas.ral;                             // grows with funnel
    const premiumFiling = yr.valueAreas.premiumFiling;         // grows with funnel
    const crossSell = yr.valueAreas.crossSell;                 // grows with funnel
    const total = ddSwitching + depositNII + ral + premiumFiling + crossSell + retention + interchange;
    return { ddSwitching, depositNII, ral, premiumFiling, crossSell, retention, interchange, total };
  });

  const cohortTotal = cohortLTVYears.reduce((sum, yr) => sum + yr.total, 0);
  const y1Filers = years[0].funnel.completedFilers;
  const ltvPerFiler = y1Filers > 0 ? cohortTotal / y1Filers : 0;

  const cohortLTV: CohortLTV = {
    years: cohortLTVYears,
    cohortTotal,
    ltvPerFiler,
  };

  return {
    years: years as [YearlyResults, YearlyResults, YearlyResults, YearlyResults, YearlyResults],
    fiveYearNetROI,
    paybackMonths,
    y1ROIPct,
    cohortLTV,
  };
}
