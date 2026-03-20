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

const VA_LABELS = [
  { key: 'depositNII', label: 'Deposit NII', color: '#5E00FF' },
  { key: 'ddSwitching', label: 'DD Switching', color: '#7B33FF' },
  { key: 'ral', label: 'RAL', color: '#9B66FF' },
  { key: 'premiumFiling', label: 'Premium Filing', color: '#E9CD62' },
  { key: 'crossSell', label: 'Cross-sell', color: '#135948' },
  { key: 'retention', label: 'Retention/LTV', color: '#475464' },
  { key: 'interchange', label: 'Interchange', color: '#CBC9E6' },
];

const Dashboard: React.FC<DashboardProps> = ({ results, activeScenario, onScenarioChange }) => {
  const scenarios: ScenarioKey[] = ['bear', 'base', 'bull'];

  // Value area breakdown chart data (Base scenario, all 5 years)
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
        <span className="text-sm font-medium" style={{ color: '#475464' }}>
          Highlight scenario:
        </span>
        {scenarios.map((s) => (
          <button
            key={s}
            onClick={() => onScenarioChange(s)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
              activeScenario === s
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={activeScenario === s ? { backgroundColor: '#5E00FF' } : {}}
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                    style={{
                      backgroundColor:
                        s === 'bear' ? '#893326' : s === 'base' ? '#5E00FF' : '#135948',
                    }}
                  >
                    {s}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs" style={{ color: '#475464' }}>5-Year Net ROI</p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: r.fiveYearNetROI >= 0 ? '#135948' : '#893326' }}
                    >
                      {formatCurrency(r.fiveYearNetROI, true)}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs" style={{ color: '#475464' }}>Payback</p>
                      <p className="text-sm font-semibold">{formatMonths(r.paybackMonths)}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#475464' }}>Y1 ROI</p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: r.y1ROIPct >= 0 ? '#135948' : '#893326' }}
                      >
                        {formatPercent(r.y1ROIPct, 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#475464' }}>Y1 Gross</p>
                      <p className="text-sm font-semibold">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
            Value Area Breakdown ({activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1)} Case)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={vaBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475464' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#475464' }}
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
            Cumulative Net ROI (All Scenarios)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475464' }} />
              <YAxis
                tick={{ fontSize: 11, fill: '#475464' }}
                tickFormatter={(v) => formatCurrency(v, true)}
              />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="Bear"
                stroke="#893326"
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
                stroke="#135948"
                strokeWidth={activeScenario === 'bull' ? 3 : 1.5}
                dot={{ r: activeScenario === 'bull' ? 5 : 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Y1 Summary table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
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
