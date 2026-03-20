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

interface ValueAreasPanelProps {
  results: AllResults;
  activeScenario: ScenarioKey;
}

// Brand-approved colors only
const VA_KEYS = [
  { key: 'depositNII', label: 'VA1: Deposit NII', color: '#5E00FF' },
  { key: 'ddSwitching', label: 'VA2: DD Switching', color: '#7B5CFF' },
  { key: 'ral', label: 'VA3: RAL', color: '#CBC9E6' },
  { key: 'premiumFiling', label: 'VA4: Premium Filing', color: '#210F4B' },
  { key: 'crossSell', label: 'VA5: Cross-sell', color: '#3A3B4D' },
  { key: 'retention', label: 'VA6: Retention/LTV', color: '#1A2040' },
  { key: 'interchange', label: 'VA7: Interchange', color: '#EAEBED' },
] as const;

const ValueAreasPanel: React.FC<ValueAreasPanelProps> = ({ results, activeScenario }) => {
  const r = results[activeScenario];
  const scenarioLabel = activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1);

  const headers = ['Value Area', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];

  const rows = [
    ...VA_KEYS.map((va) => ({
      label: va.label,
      values: r.years.map((y) =>
        formatCurrency(y.valueAreas[va.key as keyof typeof y.valueAreas] as number, true)
      ),
    })),
    {
      label: 'Total Gross Value',
      values: r.years.map((y) => formatCurrency(y.valueAreas.totalGross, true)),
      bold: true,
      highlight: true,
    },
  ];

  // Stacked bar chart data
  const chartData = r.years.map((y, i) => ({
    name: `Year ${i + 1}`,
    'Deposit NII': y.valueAreas.depositNII,
    'DD Switching': y.valueAreas.ddSwitching,
    RAL: y.valueAreas.ral,
    'Premium Filing': y.valueAreas.premiumFiling,
    'Cross-sell': y.valueAreas.crossSell,
    'Retention/LTV': y.valueAreas.retention,
    Interchange: y.valueAreas.interchange,
  }));

  // Individual VA detail cards
  const vaDetails = VA_KEYS.map((va) => {
    const y1Val = r.years[0].valueAreas[va.key as keyof typeof r.years[0]['valueAreas']] as number;
    const fiveYearTotal = r.years.reduce(
      (sum, y) => sum + (y.valueAreas[va.key as keyof typeof y.valueAreas] as number),
      0
    );
    return { ...va, y1Val, fiveYearTotal };
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2
        className="text-lg font-bold"
        style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
      >
        Value Areas - {scenarioLabel} Case
      </h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {vaDetails.map((va) => (
          <div
            key={va.key}
            className="bg-white rounded-xl shadow-sm border-t-4 p-4"
            style={{ borderTopColor: va.color }}
          >
            <p className="text-xs font-medium" style={{ color: '#3A3B4D' }}>
              {va.label.replace(/VA\d: /, '')}
            </p>
            <p className="text-lg font-bold mt-1" style={{ color: va.y1Val >= 0 ? '#5E00FF' : '#3A3B4D' }}>
              {formatCurrency(va.y1Val, true)}
            </p>
            <p className="text-xs mt-1" style={{ color: '#3A3B4D' }}>
              5yr: {formatCurrency(va.fiveYearTotal, true)}
            </p>
          </div>
        ))}
      </div>

      {/* Stacked bar chart */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
        >
          Value Area Composition by Year
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#3A3B4D' }}
              tickFormatter={(v) => formatCurrency(v, true)}
            />
            <Tooltip formatter={tooltipCurrency} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {VA_KEYS.map((va) => (
              <Bar
                key={va.key}
                dataKey={va.label.replace(/VA\d: /, '')}
                stackId="a"
                fill={va.color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data table */}
      <DataTable title={`5-Year Value Area Projections - ${scenarioLabel}`} headers={headers} rows={rows} />
    </div>
  );
};

export default ValueAreasPanel;
