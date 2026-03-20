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
} from 'recharts';
import { AllResults, ScenarioKey } from '../types';
import { formatCurrency, tooltipCurrency } from '../formatters';
import DataTable from './DataTable';

interface CostsPanelProps {
  results: AllResults;
  activeScenario: ScenarioKey;
}

// Brand-approved cost colors — using darker/muted brand palette
const COST_KEYS = [
  { key: 'platformFee', label: 'april Platform Fee', color: '#210F4B' },
  { key: 'perFilingFee', label: 'Per-Filing Fees', color: '#3A3B4D' },
  { key: 'bankMarketing', label: 'Bank Marketing', color: '#1A2040' },
  { key: 'bankOps', label: 'Bank Ops', color: '#7B5CFF' },
  { key: 'integration', label: 'Integration', color: '#CBC9E6' },
  { key: 'displacedRevenue', label: 'Displaced Revenue', color: '#EAEBED' },
  { key: 'ralCompliance', label: 'RAL Compliance', color: '#5E00FF' },
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
      <h2
        className="text-lg font-bold"
        style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
      >
        Cost Analysis - {scenarioLabel} Case
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border-t-4 p-4" style={{ borderTopColor: '#3A3B4D' }}>
          <p className="text-xs font-medium" style={{ color: '#3A3B4D' }}>Y1 Total Costs</p>
          <p className="text-xl font-bold" style={{ color: '#3A3B4D' }}>
            {formatCurrency(r.years[0].costs.totalCosts, true)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border-t-4 p-4" style={{ borderTopColor: '#5E00FF' }}>
          <p className="text-xs font-medium" style={{ color: '#3A3B4D' }}>Y1 Gross Value</p>
          <p className="text-xl font-bold" style={{ color: '#5E00FF' }}>
            {formatCurrency(r.years[0].valueAreas.totalGross, true)}
          </p>
        </div>
        <div
          className="bg-white rounded-xl shadow-sm border-t-4 p-4"
          style={{ borderTopColor: r.years[0].netROI >= 0 ? '#5E00FF' : '#3A3B4D' }}
        >
          <p className="text-xs font-medium" style={{ color: '#3A3B4D' }}>Y1 Net ROI</p>
          <p className="text-xl font-bold" style={{ color: r.years[0].netROI >= 0 ? '#5E00FF' : '#3A3B4D' }}>
            {formatCurrency(r.years[0].netROI, true)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border-t-4 p-4" style={{ borderTopColor: '#7B5CFF' }}>
          <p className="text-xs font-medium" style={{ color: '#3A3B4D' }}>5-Year Cumulative</p>
          <p
            className="text-xl font-bold"
            style={{ color: r.years[4].cumulativeNet >= 0 ? '#5E00FF' : '#3A3B4D' }}
          >
            {formatCurrency(r.years[4].cumulativeNet, true)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Cost Breakdown by Year
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={costChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
              <YAxis tick={{ fontSize: 11, fill: '#3A3B4D' }} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Platform Fee" stackId="a" fill="#210F4B" />
              <Bar dataKey="Per-Filing" stackId="a" fill="#3A3B4D" />
              <Bar dataKey="Marketing" stackId="a" fill="#1A2040" />
              <Bar dataKey="Bank Ops" stackId="a" fill="#7B5CFF" />
              <Bar dataKey="Integration" stackId="a" fill="#CBC9E6" />
              <Bar dataKey="Displaced Rev" stackId="a" fill="#EAEBED" />
              <Bar dataKey="RAL Compliance" stackId="a" fill="#5E00FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gross vs Cost vs Net */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Gross Value vs Costs vs Net ROI
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
              <YAxis tick={{ fontSize: 11, fill: '#3A3B4D' }} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Gross Value" fill="#7B5CFF" />
              <Bar dataKey="Total Costs" fill="#3A3B4D" />
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
