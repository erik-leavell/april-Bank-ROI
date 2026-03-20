import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { AllResults, ScenarioKey } from '../types';
import { formatCurrency, formatPercent, formatMonths, formatNumber, tooltipCurrency } from '../formatters';

interface ScenarioPanelProps {
  results: AllResults;
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({ results }) => {
  const scenarios: { key: ScenarioKey; label: string; color: string }[] = [
    { key: 'bear', label: 'Bear', color: '#3A3B4D' },
    { key: 'base', label: 'Base', color: '#5E00FF' },
    { key: 'bull', label: 'Bull', color: '#210F4B' },
  ];

  // Summary comparison
  const summaryRows = [
    {
      label: 'Y1 Engaged Customers',
      values: scenarios.map((s) => formatNumber(results[s.key].years[0].funnel.engagedCustomers, true)),
    },
    {
      label: 'Y1 Completed Filers',
      values: scenarios.map((s) => formatNumber(results[s.key].years[0].funnel.completedFilers, true)),
    },
    {
      label: 'Y1 Gross Value',
      values: scenarios.map((s) => formatCurrency(results[s.key].years[0].valueAreas.totalGross, true)),
    },
    {
      label: 'Y1 Total Costs',
      values: scenarios.map((s) => formatCurrency(results[s.key].years[0].costs.totalCosts, true)),
    },
    {
      label: 'Y1 Net ROI',
      values: scenarios.map((s) => formatCurrency(results[s.key].years[0].netROI, true)),
      bold: true,
    },
    {
      label: 'Y1 ROI %',
      values: scenarios.map((s) => formatPercent(results[s.key].y1ROIPct, 0)),
    },
    {
      label: 'Payback Period',
      values: scenarios.map((s) => formatMonths(results[s.key].paybackMonths)),
    },
    {
      label: '5-Year Net ROI',
      values: scenarios.map((s) => formatCurrency(results[s.key].fiveYearNetROI, true)),
      bold: true,
      highlight: true,
    },
  ];

  // Value area comparison
  const vaLabels = [
    { key: 'depositNII', label: 'Deposit NII' },
    { key: 'ddSwitching', label: 'DD Switching' },
    { key: 'ral', label: 'RAL' },
    { key: 'premiumFiling', label: 'Premium Filing' },
    { key: 'crossSell', label: 'Cross-sell' },
    { key: 'retention', label: 'Retention/LTV' },
    { key: 'interchange', label: 'Interchange' },
  ];

  const vaRows = vaLabels.map((va) => ({
    label: va.label,
    values: scenarios.map((s) => {
      const total = results[s.key].years.reduce(
        (sum, y) => sum + (y.valueAreas[va.key as keyof typeof y.valueAreas] as number),
        0
      );
      return formatCurrency(total, true);
    }),
  }));

  vaRows.push({
    label: '5-Year Total Gross',
    values: scenarios.map((s) => {
      const total = results[s.key].years.reduce((sum, y) => sum + y.valueAreas.totalGross, 0);
      return formatCurrency(total, true);
    }),
  });

  // Cumulative line chart
  const cumulativeData = Array.from({ length: 5 }, (_, y) => ({
    name: `Year ${y + 1}`,
    Bear: results.bear.years[y].cumulativeNet,
    Base: results.base.years[y].cumulativeNet,
    Bull: results.bull.years[y].cumulativeNet,
  }));

  // Annual net ROI
  const annualData = Array.from({ length: 5 }, (_, y) => ({
    name: `Year ${y + 1}`,
    Bear: results.bear.years[y].netROI,
    Base: results.base.years[y].netROI,
    Bull: results.bull.years[y].netROI,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2
        className="text-lg font-bold"
        style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
      >
        Scenario Comparison: Bear vs Base vs Bull
      </h2>

      {/* Key metrics side by side */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3" style={{ backgroundColor: '#1A2040' }}>
          <h3 className="text-sm font-semibold text-white">Key Metrics Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid #EAEBED' }}>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: '#1A2040' }}>
                  Metric
                </th>
                {scenarios.map((s) => (
                  <th key={s.key} className="text-right px-5 py-3">
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: s.color, letterSpacing: '0.08em' }}
                    >
                      {s.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    backgroundColor: row.highlight
                      ? 'rgba(94, 0, 255, 0.06)'
                      : idx % 2 === 1
                      ? '#F5F5F7'
                      : 'white',
                    borderBottom: '1px solid #EAEBED',
                  }}
                >
                  <td
                    className={`px-5 py-2.5 ${row.bold ? 'font-semibold' : ''}`}
                    style={{ color: row.highlight ? '#5E00FF' : '#1A2040' }}
                  >
                    {row.label}
                  </td>
                  {row.values.map((v, i) => {
                    const isNeg = v.startsWith('-');
                    return (
                      <td
                        key={i}
                        className={`text-right px-5 py-2.5 ${row.bold ? 'font-semibold' : ''}`}
                        style={{
                          color: row.highlight ? '#5E00FF' : isNeg ? '#3A3B4D' : '#1A2040',
                        }}
                      >
                        {v}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Year Value Area totals */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-3" style={{ backgroundColor: '#1A2040' }}>
          <h3 className="text-sm font-semibold text-white">5-Year Value Area Totals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid #EAEBED' }}>
                <th className="text-left px-5 py-3 font-semibold" style={{ color: '#1A2040' }}>
                  Value Area
                </th>
                {scenarios.map((s) => (
                  <th key={s.key} className="text-right px-5 py-3">
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: s.color, letterSpacing: '0.08em' }}
                    >
                      {s.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vaRows.map((row, idx) => {
                const isLast = idx === vaRows.length - 1;
                return (
                  <tr
                    key={idx}
                    style={{
                      backgroundColor: isLast
                        ? 'rgba(94, 0, 255, 0.06)'
                        : idx % 2 === 1
                        ? '#F5F5F7'
                        : 'white',
                      borderBottom: '1px solid #EAEBED',
                    }}
                  >
                    <td
                      className={`px-5 py-2.5 ${isLast ? 'font-semibold' : ''}`}
                      style={{ color: isLast ? '#5E00FF' : '#1A2040' }}
                    >
                      {row.label}
                    </td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`text-right px-5 py-2.5 ${isLast ? 'font-semibold' : ''}`}
                        style={{ color: v.startsWith('-') ? '#3A3B4D' : '#1A2040' }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Cumulative Net ROI
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
              <YAxis tick={{ fontSize: 11, fill: '#3A3B4D' }} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Bear" stroke="#3A3B4D" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Base" stroke="#5E00FF" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Bull" stroke="#210F4B" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: '#1A2040', fontFamily: "'Inter Tight', 'Inter', sans-serif" }}
          >
            Annual Net ROI
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={annualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#3A3B4D' }} />
              <YAxis tick={{ fontSize: 11, fill: '#3A3B4D' }} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip formatter={tooltipCurrency} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Bear" stroke="#3A3B4D" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Base" stroke="#5E00FF" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Bull" stroke="#210F4B" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPanel;
