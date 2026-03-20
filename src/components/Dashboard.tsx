import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { AllResults, ScenarioKey } from '../types';
import { formatCurrency, formatPercent, formatMonths, tooltipCurrency } from '../formatters';
import MetricCard from './MetricCard';

interface DashboardProps {
  results: AllResults;
  activeScenario: ScenarioKey;
  onScenarioChange: (s: ScenarioKey) => void;
}

// Brand-approved chart colors only
const VA_LABELS = [
  { key: 'depositNII', label: 'Deposit NII', color: '#5E00FF' },
  { key: 'ddSwitching', label: 'DD Switching', color: '#7B5CFF' },
  { key: 'ral', label: 'RAL', color: '#CBC9E6' },
  { key: 'premiumFiling', label: 'Premium Filing', color: '#210F4B' },
  { key: 'crossSell', label: 'Cross-sell', color: '#3A3B4D' },
  { key: 'retention', label: 'Retention/LTV', color: '#1A2040' },
  { key: 'interchange', label: 'Interchange', color: '#EAEBED' },
];

// Scenario colors: brand palette only
const SCENARIO_COLORS: Record<ScenarioKey, string> = {
  bear: '#3A3B4D',
  base: '#5E00FF',
  bull: '#210F4B',
};

const Dashboard: React.FC<DashboardProps> = ({ results, activeScenario, onScenarioChange }) => {
  const scenarios: ScenarioKey[] = ['bear', 'base', 'bull'];

  // Value area breakdown chart data
  const vaBreakdownData = Array.from({ length: 5 }, (_, y) => {
    const va = results[activeScenario].years[y].valueAreas;
    return {
      name: `Year ${y + 1}`,
      'Deposit NII': va.depositNII,
      'DD Switching': va.ddSwitching,
      RAL: va.ral,
      'Premium Filing': va.premiumFiling,
      'Cross-sell': va.crossSell,
      'Retention/LTV': va.retention,
      Interchange: va.interchange,
    };
  });

  // Cumulative ROI line chart data
  const cumulativeData = Array.from({ length: 5 }, (_, y) => ({
    name: `Year ${y + 1}`,
    Bear: results.bear.years[y].cumulativeNet,
    Base: results.base.years[y].cumulativeNet,
    Bull: results.bull.years[y].cumulativeNet,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Scenario selector */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium" style={{ color: '#3A3B4D' }}>
          Highlight scenario:
        </span>
        {scenarios.map((s) => (
          <button
            key={s}
            onClick={() => onScenarioChange(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
              activeScenario === s
                ? 'text-white shadow-sm'
                : 'text-[#3A3B4D] hover:opacity-80'
            }`}
            style={{
              backgroundColor: activeScenario === s ? SCENARIO_COLORS[s] : '#EAEBED',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s) => {
          const r = results[s];
          const isActive = s === activeScenario;
          return (
            <div
              key={s}
              className={`cursor-pointer rounded-xl transition-all ${
                isActive ? 'ring-2 ring-[#5E00FF] shadow-md' : ''
              }`}
              onClick={() => onScenarioChange(s)}
            >
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor: SCENARIO_COLORS[s],
                      letterSpacing: '0.08em',
                    }}
                  >
                    {s}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs" style={{ color: '#3A3B4D' }}>5-Year Net ROI</p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: r.fiveYearNetROI >= 0 ? '#5E00FF' : '#3A3B4D' }}
                    >
                      {formatCurrency(r.fiveYearNetROI, true)}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs" style={{ color: '#3A3B4D' }}>Payback</p>
                      <p className="text-sm font-semibold" style={{ color: '#1A2040' }}>
                        {formatMonths(r.paybackMonths)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#3A3B4D' }}>Y1 ROI</p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: r.y1ROIPct >= 0 ? '#5E00FF' : '#3A3B4D' }}
                      >
                        {formatPercent(r.y1ROIPct, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#3A3B4D' }}>Y1 Gross</p>
                      <p className="text-sm font-semibold" style={{ color: '#1A2040' }}>
                        {formatCurrency(r.years[0].valueAreas.totalGross, true)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value area breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Value Area Breakdown ({activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)} Case)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={vaBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#3A3B4D' }}
                tickFormatter={(v) => formatCurrency(v, true)}
              />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {VA_LABELS.map((va) => (
                <Bar
                  key={va.key}
                  dataKey={va.label}
                  stackId="a"
                  fill={va.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative Net ROI */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Cumulative Net ROI (All Scenarios)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#3A3B4D' }}
                tickFormatter={(v) => formatCurrency(v, true)}
              />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="Bear"
                stroke="#3A3B4D"
                strokeWidth={activeScenario === 'bear' ? 3 : 1.5}
                dot={{ r: activeScenario === 'bear' ? 5 : 3 }}
              />
              <Line
                type="monotone"
                dataKey="Base"
                stroke="#5E00FF"
                strokeWidth={activeScenario === 'base' ? 3 : 1.5}
                dot={{ r: activeScenario === 'base' ? 5 : 3 }}
              />
              <Line
                type="monotone"
                dataKey="Bull"
                stroke="#210F4B"
                strokeWidth={activeScenario === 'bull' ? 3 : 1.5}
                dot={{ r: activeScenario === 'bull' ? 5 : 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort LTV */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
        >
          Y1 Cohort LTV — {activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)} Case
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <MetricCard
            label="Cohort LTV (5yr)"
            value={formatCurrency(results[activeScenario].cohortLTV.cohortTotal, true)}
            variant="positive"
          />
          <MetricCard
            label="LTV per Y1 Filer"
            value={`$${Math.round(results[activeScenario].cohortLTV.ltvPerFiler).toLocaleString()}`}
            variant="positive"
          />
          <MetricCard
            label="Y1 Completed Filers"
            value={formatCurrency(results[activeScenario].years[0].funnel.completedFilers, true).replace('$', '')}
            variant="default"
            sublabel="Base for LTV calculation"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid #EAEBED' }}>
                <th className="text-left px-3 py-2 font-semibold" style={{ color: '#1A2040' }}>Value Area</th>
                {['Cal Y1', 'Cal Y2', 'Cal Y3', 'Cal Y4', 'Cal Y5', 'Cohort LTV'].map((h) => (
                  <th key={h} className="text-right px-3 py-2 font-semibold" style={{ color: '#1A2040' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'DD Switching', key: 'ddSwitching' as const, flat: true },
                { label: 'Deposit NII', key: 'depositNII' as const, flat: false },
                { label: 'RAL', key: 'ral' as const, flat: false },
                { label: 'Premium Filing', key: 'premiumFiling' as const, flat: false },
                { label: 'Cross-sell', key: 'crossSell' as const, flat: false },
                { label: 'Retention', key: 'retention' as const, flat: true },
                { label: 'Interchange', key: 'interchange' as const, flat: true },
              ].map((va, idx) => {
                const cohort = results[activeScenario].cohortLTV;
                const rowTotal = cohort.years.reduce((s, yr) => s + yr[va.key], 0);
                return (
                  <tr
                    key={va.key}
                    style={{
                      backgroundColor: idx % 2 === 1 ? '#F5F5F7' : 'white',
                      borderBottom: '1px solid #EAEBED',
                    }}
                  >
                    <td className="px-3 py-2" style={{ color: '#1A2040' }}>
                      {va.label}
                      {va.flat && (
                        <span className="ml-1 text-xs" style={{ color: '#CBC9E6' }}>(flat)</span>
                      )}
                    </td>
                    {cohort.years.map((yr, y) => (
                      <td key={y} className="text-right px-3 py-2" style={{ color: '#1A2040' }}>
                        {formatCurrency(yr[va.key], true)}
                      </td>
                    ))}
                    <td className="text-right px-3 py-2 font-semibold" style={{ color: '#5E00FF' }}>
                      {formatCurrency(rowTotal, true)}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ backgroundColor: 'rgba(94, 0, 255, 0.06)', borderBottom: '1px solid #EAEBED' }}>
                <td className="px-3 py-2 font-semibold" style={{ color: '#5E00FF' }}>Y1 Cohort Total</td>
                {results[activeScenario].cohortLTV.years.map((yr, y) => (
                  <td key={y} className="text-right px-3 py-2 font-semibold" style={{ color: '#5E00FF' }}>
                    {formatCurrency(yr.total, true)}
                  </td>
                ))}
                <td className="text-right px-3 py-2 font-bold" style={{ color: '#5E00FF' }}>
                  {formatCurrency(results[activeScenario].cohortLTV.cohortTotal, true)}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium" style={{ color: '#3A3B4D' }}>LTV per Y1 Filer</td>
                <td colSpan={5} />
                <td className="text-right px-3 py-2 font-bold" style={{ color: '#5E00FF' }}>
                  ${Math.round(results[activeScenario].cohortLTV.ltvPerFiler).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Y1 Summary table */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
        >
          Year 1 Summary ({activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)} Case)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VA_LABELS.map((va) => {
            const val =
              results[activeScenario].years[0].valueAreas[
                va.key as keyof typeof results.base.years[0]['valueAreas']
              ];
            return (
              <MetricCard
                key={va.key}
                label={va.label}
                value={formatCurrency(val as number, true)}
                variant={val >= 0 ? 'positive' : 'negative'}
              />
            );
          })}
          <MetricCard
            label="Total Costs"
            value={formatCurrency(results[activeScenario].years[0].costs.totalCosts, true)}
            variant="negative"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
