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
import { formatNumber, formatPercent, formatCurrency, tooltipNumber } from '../formatters';
import DataTable from './DataTable';

interface FunnelPanelProps {
  results: AllResults;
  activeScenario: ScenarioKey;
}

const FunnelPanel: React.FC<FunnelPanelProps> = ({ results, activeScenario }) => {
  const r = results[activeScenario];
  const scenarioLabel = activeScenario.charAt(0).toUpperCase() + activeScenario.slice(1);

  // Funnel visual for Year 1
  const y1 = r.years[0].funnel;
  const funnelStages = [
    { label: 'Total Customers', value: 18000000 },
    { label: 'Engaged', value: y1.engagedCustomers },
    { label: 'Completed Filers', value: y1.completedFilers },
    { label: 'Refund Eligible', value: y1.refundEligible },
    { label: 'New DD Switchers', value: y1.newDDSwitchers },
  ];

  const maxVal = funnelStages[0].value;

  // Table data
  const headers = ['Metric', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  const rows = [
    {
      label: 'Engagement Rate',
      values: r.years.map((y) => formatPercent(y.funnel.engagementRate)),
    },
    {
      label: 'Completion Rate',
      values: r.years.map((y) => formatPercent(y.funnel.completionRate)),
    },
    {
      label: 'Engaged Customers',
      values: r.years.map((y) => formatNumber(y.funnel.engagedCustomers, true)),
      bold: true,
    },
    {
      label: 'Completed Filers',
      values: r.years.map((y) => formatNumber(y.funnel.completedFilers, true)),
      bold: true,
    },
    {
      label: 'Refund Eligible',
      values: r.years.map((y) => formatNumber(y.funnel.refundEligible, true)),
    },
    {
      label: 'New DD Switchers',
      values: r.years.map((y) => formatNumber(y.funnel.newDDSwitchers, true)),
    },
    {
      label: 'Cumulative DD',
      values: r.years.map((y) => formatNumber(y.funnel.cumulativeDD, true)),
      bold: true,
      highlight: true,
    },
  ];

  // Chart data - engaged vs filers over 5 years
  const chartData = r.years.map((y, i) => ({
    name: `Year ${i + 1}`,
    Engaged: y.funnel.engagedCustomers,
    Filers: y.funnel.completedFilers,
    'DD Switchers (Cumul.)': y.funnel.cumulativeDD,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className="text-lg font-bold" style={{ color: '#475464' }}>
        Engagement Funnel - {scenarioLabel} Case
      </h2>

      {/* Visual funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
          Year 1 Funnel
        </h3>
        <div className="space-y-3 max-w-2xl mx-auto">
          {funnelStages.map((stage, i) => {
            const width = Math.max((stage.value / maxVal) * 100, 8);
            const colors = ['#5E00FF', '#7B33FF', '#9B66FF', '#CBC9E6', '#E9CD62'];
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-36 text-right text-xs font-medium" style={{ color: '#475464' }}>
                  {stage.label}
                </div>
                <div className="flex-1 relative">
                  <div
                    className="h-8 rounded-r-lg flex items-center justify-end pr-3 transition-all"
                    style={{
                      width: `${width}%`,
                      backgroundColor: colors[i],
                      minWidth: 80,
                    }}
                  >
                    <span className="text-xs font-bold text-white">
                      {formatNumber(stage.value, true)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#475464' }}>
          Volume Growth Over 5 Years
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#475464' }} />
            <YAxis tick={{ fontSize: 11, fill: '#475464' }} tickFormatter={(v) => formatNumber(v, true)} />
            <Tooltip formatter={tooltipNumber} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Engaged" fill="#5E00FF" />
            <Bar dataKey="Filers" fill="#9B66FF" />
            <Bar dataKey="DD Switchers (Cumul.)" fill="#E9CD62" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data table */}
      <DataTable title={`Funnel Metrics - ${scenarioLabel} Case`} headers={headers} rows={rows} />
    </div>
  );
};

export default FunnelPanel;
