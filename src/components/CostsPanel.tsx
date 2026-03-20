import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { AllResults, ScenarioKey } from '../types';
import { formatCurrency, tooltipCurrency } from '../formatters';
import DataTable from './DataTable';

interface CostsPanelProps {
  results: AllResults;
  activeScenario: ScenarioKey;
}

const COST_KEYS = [
  { key: 'platformFee', label: 'April Platform Fee', color: '#893326' },
  { key: 'perFilingFee', label: 'Per-Filing Fees', color: '#B5493A' },
  { key: 'bankMarketing', label: 'Bank Marketing', color: '#D4695C' },
  { key: 'bankOps', label: 'Bank Ops', color: '#E9CD62' },
  { key: 'integration', label: 'Integration', color: '#475464' },
  { key: 'displacedRevenue', label: 'Displaced Revenue', color: '#CBC9E6' },
  { key: 'ralCompliance', label: 'RAL Compliance', color: '#9B66FF' },
] as const;

const CostsPanel: React.FC<CostsPanelProps> = ({ results, activeScenario }) => {
  const r = results[activeScenario];
  const scenarioLabel = activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1);

  const headers = ['Cost Line', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];

  const rows = [
    ...COST_KEYS.map((c) => ({
      label: c.label,
      values: r.years.map((y) =>
        formatCurrency(y.costs[c.key as keyof typeof y.costs] as number, true)
      ),
    })),
    {
      label: 'Total Costs',
      values: r.years.map((y) => formatCurrency(y.costs.totalCosts, true)),
      bold: true,
      highlight: true,
    },
    {
      label: 'Total Gross Value',
      values: r.years.map((y) => formatCurrency(y.valueAreas.totalGross, true)),
      bold: true,
    },
    {
      label: 'Net ROI',
      values: r.years.map((y) => formatCurrency(y.netROI, true)),
      bold: true,
      highlight: true,
    },
  ];

  // Stacked cost bar chart
  const costChartData = r.years.map((y, i) => ({
    name: `Year ${i + 1}`,
    'Platform Fee': y.costs.platformFee,
    'Per-Filing': y.costs.perFilingFee,
    Marketing: y.costs.bankMarketing,
    'Bank Ops': y.costs.bankOps,
    Integration: y.costs.integration,
    'Displaced Rev': y.costs.displacedRevenue,
    'RAL Compliance': y.costs.ralCompliance,
  }));

  // Net ROI waterfall
  const waterfallData = r.years.map((y, i) => ({
    name: `Year ${i + 1}`,
    'Gross Value': y.valueAreas.totalGross,
    'Total Costs': -y.costs.totalCosts,
    'Net ROI': y.netROI,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className="text-lg font-bold" style={{ color: '#475464' }}>
        Cost Analysis - {scenarioLabel} Case
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border-t-4 p-4" style={{ borderTopColor: '#893326' }}>
          <p className="text-xs font-medium" style={{ color: '#475464' }}>Y1 Total Costs</p>
          <p className="text-xl font-bold" style={{ color: '#893326' }}>
            {formatCurrency(r.years[0].costs.totalCosts, true)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border-t-4 p-4" style={{ borderTopColor: '#135948' }}>
          <p className="text-xs font-medium" style={{ color: '#475464' }}>Y1 Gross Value</p>
          <p className="text-xl font-bold" style={{ color: '#135948' }}>
            {formatCurrency(r.years[0].valueAreas.totalGross, true)}
          </p>
        </div>
        <div
          className="bg-white rounded-xl shadow-sm border-t-4 p-4"
          style={{ borderTopColor: r.years[0].netROI >= 0 ? '#135948' : '#893326' }}
        >
          <p className="text-xs font-medium" style={{ color: '#475464' }}>Y1 Net ROI</p>
          <p className="text-xl font-bold" style={{ color: r.years[0].netROI >= 0 ? '#135948' : '#893326' }}>
            {formatCurrency(r.years[0].netROI, true)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border-t-4 p-4" style={{ borderTopColor: '#5E00FF' }}>
          <p className="text-xs font-medium" style={{ color: '#475464' }}>5-Year Cumulative</p>
          <p
            className="text-xl font-bold"
            style={{ color: r.years[4].cumulativeNet >= 0 ? '#135948' : '#893326' }}
          >
            {formatCurrency(r.years[4].cumulativeNet, true)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
            Cost Breakdown by Year
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={costChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475464' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475464' }} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Platform Fee" stackId="a" fill="#893326" />
              <Bar dataKey="Per-Filing" stackId="a" fill="#B5493A" />
              <Bar dataKey="Marketing" stackId="a" fill="#D4695C" />
              <Bar dataKey="Bank Ops" stackId="a" fill="#E9CD62" />
              <Bar dataKey="Integration" stackId="a" fill="#475464" />
              <Bar dataKey="Displaced Rev" stackId="a" fill="#CBC9E6" />
              <Bar dataKey="RAL Compliance" stackId="a" fill="#9B66FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gross vs Cost vs Net */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
            Gross Value vs Costs vs Net ROI
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475464' }} />
              <YAxis tick={{ fontSize: 11, fill: '#475464' }} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Gross Value" fill="#135948" />
              <Bar dataKey="Total Costs" fill="#893326" />
              <Bar dataKey="Net ROI" fill="#5E00FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data table */}
      <DataTable title={`Cost Detail - ${scenarioLabel}`} headers={headers} rows={rows} />
    </div>
  );
};

export default CostsPanel;
