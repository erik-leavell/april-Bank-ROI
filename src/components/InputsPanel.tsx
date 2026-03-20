import React, { useState } from 'react';
import { AllInputs, ScenarioInputs, ScenarioKey } from '../types';
import InputField from './InputField';

interface InputsPanelProps {
  inputs: AllInputs;
  onInputChange: (scenario: ScenarioKey, field: keyof ScenarioInputs, value: number | string | boolean) => void;
  onReset: () => void;
}

interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

interface FieldConfig {
  key: keyof ScenarioInputs;
  label: string;
  min: number;
  max: number;
  step: number;
  format: 'percent' | 'currency' | 'number' | 'decimal';
  locked?: boolean;
  highlight?: 'bank' | 'editable' | 'locked';
}

const SECTIONS: SectionConfig[] = [
  {
    title: 'Bank Profile',
    fields: [
      { key: 'totalCustomers', label: 'Total Customers', min: 1000000, max: 100000000, step: 1000000, format: 'number', highlight: 'bank' },
      { key: 'ftpCreditRate', label: 'FTP Credit Rate', min: 0, max: 0.10, step: 0.001, format: 'percent', highlight: 'bank' },
      { key: 'nim', label: 'NIM', min: 0, max: 0.10, step: 0.001, format: 'percent', highlight: 'bank' },
    ],
  },
  {
    title: 'Funnel',
    fields: [
      { key: 'engagementRate', label: 'Engagement Rate', min: 0, max: 0.50, step: 0.005, format: 'percent' },
      { key: 'completionRate', label: 'Completion Rate', min: 0, max: 0.70, step: 0.005, format: 'percent' },
      { key: 'refundEligibility', label: 'Refund Eligibility', min: 0.90, max: 1.0, step: 0.01, format: 'percent', locked: true, highlight: 'locked' },
      { key: 'existingDDPenetration', label: 'Existing DD Penetration', min: 0, max: 1.0, step: 0.01, format: 'percent', highlight: 'bank' },
    ],
  },
  {
    title: 'Deposit Value',
    fields: [
      { key: 'avgTaxRefund', label: 'Avg Tax Refund ($)', min: 1000, max: 10000, step: 100, format: 'currency', locked: true, highlight: 'locked' },
      { key: 'incrementalDepositRate', label: 'Incremental Deposit Rate', min: 0, max: 0.80, step: 0.01, format: 'percent' },
      { key: 'refundEffDuration', label: 'Refund Eff. Duration (yrs)', min: 0.1, max: 1.0, step: 0.01, format: 'decimal' },
    ],
  },
  {
    title: 'DD Switching',
    fields: [
      { key: 'ddSwitchRate', label: 'DD Switch Rate', min: 0, max: 0.30, step: 0.005, format: 'percent' },
      { key: 'avgAnnualPayroll', label: 'Avg Annual Payroll ($)', min: 30000, max: 200000, step: 1000, format: 'currency' },
      { key: 'adbForDD', label: 'ADB for DD ($)', min: 2000, max: 20000, step: 100, format: 'currency', locked: true, highlight: 'locked' },
      { key: 'y1PartialFactor', label: 'Year 1 Partial Factor', min: 0.3, max: 1.0, step: 0.05, format: 'decimal' },
    ],
  },
  {
    title: 'Refund Advance Loan (RAL)',
    fields: [
      { key: 'ralEligibility', label: 'RAL Eligibility', min: 0, max: 1.0, step: 0.01, format: 'percent' },
      { key: 'ralTakeRate', label: 'RAL Take Rate', min: 0, max: 0.60, step: 0.01, format: 'percent' },
      { key: 'avgAdvance', label: 'Avg Advance ($)', min: 500, max: 10000, step: 100, format: 'currency' },
      { key: 'feeAPR', label: 'Fee/APR', min: 0, max: 0.15, step: 0.005, format: 'percent' },
      { key: 'lossRate', label: 'Loss Rate', min: 0, max: 0.10, step: 0.001, format: 'percent' },
      { key: 'costOfCapital', label: 'Cost of Capital', min: 0, max: 0.15, step: 0.005, format: 'percent' },
    ],
  },
  {
    title: 'Premium Filing',
    fields: [
      { key: 'payingFilerRate', label: 'Paying Filer Rate', min: 0, max: 0.40, step: 0.01, format: 'percent' },
      { key: 'avgRevPerFiling', label: 'Avg Revenue/Filing ($)', min: 25, max: 500, step: 5, format: 'currency' },
      { key: 'bankRevShare', label: 'Bank Rev Share', min: 0, max: 0.60, step: 0.01, format: 'percent' },
    ],
  },
  {
    title: 'Cross-sell',
    fields: [
      { key: 'crossSellEligibility', label: 'Eligibility Rate', min: 0, max: 1.0, step: 0.01, format: 'percent' },
      { key: 'crossSellConversion', label: 'Conversion Rate', min: 0, max: 0.40, step: 0.005, format: 'percent' },
      { key: 'avgProductRevenue', label: 'Avg Product Revenue ($)', min: 25, max: 500, step: 5, format: 'currency' },
      { key: 'productProfitMargin', label: 'Product Profit Margin', min: 0, max: 1.0, step: 0.01, format: 'percent' },
    ],
  },
  {
    title: 'Retention / LTV',
    fields: [
      { key: 'churnReduction', label: 'Churn Reduction (pp)', min: 0, max: 0.10, step: 0.005, format: 'percent' },
      { key: 'avgAnnualCustomerValue', label: 'Avg Annual Customer Value ($)', min: 50, max: 1000, step: 10, format: 'currency' },
      { key: 'baselineChurnRate', label: 'Baseline Churn Rate', min: 0.01, max: 0.20, step: 0.005, format: 'percent', highlight: 'bank' },
    ],
  },
  {
    title: 'Costs',
    fields: [
      { key: 'aprilPlatformFee', label: 'April Platform Fee ($/yr)', min: 0, max: 5000000, step: 100000, format: 'currency' },
      { key: 'aprilPerFilingFee', label: 'April Per-Filing Fee ($)', min: 0, max: 50, step: 1, format: 'currency' },
      { key: 'bankMarketingPerEngaged', label: 'Bank Marketing ($/engaged)', min: 0, max: 10, step: 0.5, format: 'currency' },
      { key: 'bankOpsCostPerYear', label: 'Bank Ops Cost ($/yr)', min: 0, max: 10000000, step: 100000, format: 'currency' },
      { key: 'integrationAmortPerYear', label: 'Integration (amort $/yr)', min: 0, max: 3000000, step: 50000, format: 'currency' },
      { key: 'displacedRevenuePerYear', label: 'Displaced Revenue ($/yr)', min: 0, max: 5000000, step: 100000, format: 'currency' },
      { key: 'ralComplianceY1', label: 'RAL Compliance - Year 1 ($)', min: 0, max: 3000000, step: 50000, format: 'currency' },
      { key: 'ralComplianceY2to5', label: 'RAL Compliance - Year 2-5 ($)', min: 0, max: 3000000, step: 50000, format: 'currency' },
    ],
  },
  {
    title: 'Growth Assumptions',
    fields: [
      { key: 'yoyEngagementGrowth', label: 'YoY Engagement Growth', min: 0, max: 0.50, step: 0.01, format: 'percent' },
      { key: 'yoyCompletionImprovement', label: 'YoY Completion Improvement (pp)', min: 0, max: 0.10, step: 0.005, format: 'percent' },
    ],
  },
];

const InputsPanel: React.FC<InputsPanelProps> = ({ inputs, onInputChange, onReset }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.title, true]))
  );

  const scenarios: ScenarioKey[] = ['bear', 'base', 'bull'];

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold" style={{ color: '#475464' }}>
            Model Inputs
          </h2>
          <p className="text-xs text-gray-500">
            Adjust inputs across Bear, Base, and Bull scenarios
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bank Name */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium" style={{ color: '#475464' }}>Bank Name:</label>
            <input
              type="text"
              value={inputs.base.bankName}
              onChange={(e) => {
                scenarios.forEach((s) => onInputChange(s, 'bankName', e.target.value));
              }}
              className="border border-[#E9CD62] bg-[#FEFBF0] rounded px-2 py-1 text-sm"
              style={{ width: 160 }}
            />
          </div>
          {/* FTP/NIM toggle */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium" style={{ color: '#475464' }}>Rate:</label>
            <button
              onClick={() => {
                const newVal = !inputs.base.useFTP;
                scenarios.forEach((s) => onInputChange(s, 'useFTP', newVal));
              }}
              className="text-xs px-3 py-1 rounded-full font-semibold border transition-all"
              style={{
                backgroundColor: inputs.base.useFTP ? '#5E00FF' : '#F7F5FB',
                color: inputs.base.useFTP ? 'white' : '#5E00FF',
                borderColor: '#5E00FF',
              }}
            >
              {inputs.base.useFTP ? 'FTP' : 'NIM'}
            </button>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Scenario column headers */}
      <div className="grid grid-cols-[220px_1fr_1fr_1fr] gap-3 px-2">
        <div />
        {scenarios.map((s) => (
          <div
            key={s}
            className="text-center text-xs font-bold uppercase tracking-wider py-1 rounded-t"
            style={{
              color: s === 'bear' ? '#893326' : s === 'base' ? '#5E00FF' : '#135948',
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => (
        <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between px-5 py-3 text-left"
            style={{ backgroundColor: '#475464' }}
          >
            <span className="text-sm font-semibold text-white">{section.title}</span>
            <span className="text-white text-lg">{openSections[section.title] ? '-' : '+'}</span>
          </button>
          {openSections[section.title] && (
            <div className="px-5 py-4 space-y-4">
              {section.fields.map((field) => (
                <div key={field.key} className="grid grid-cols-[220px_1fr_1fr_1fr] gap-3 items-end">
                  <div className="text-xs font-medium py-2" style={{ color: '#475464' }}>
                    {field.label}
                  </div>
                  {scenarios.map((s) => (
                    <InputField
                      key={`${s}-${field.key}`}
                      label=""
                      value={inputs[s][field.key] as number}
                      onChange={(v) => onInputChange(s, field.key, v)}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      format={field.format}
                      locked={field.locked}
                      highlight={field.highlight || 'editable'}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InputsPanel;
