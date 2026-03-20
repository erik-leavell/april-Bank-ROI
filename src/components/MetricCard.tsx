import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  variant?: 'default' | 'positive' | 'negative';
  scenario?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  variant = 'default',
  scenario,
}) => {
  const borderColor =
    variant === 'positive'
      ? '#5E00FF'
      : variant === 'negative'
      ? '#3A3B4D'
      : '#7B5CFF';

  const valueColor =
    variant === 'positive'
      ? '#5E00FF'
      : variant === 'negative'
      ? '#3A3B4D'
      : '#1A2040';

  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm border-t-4"
      style={{ borderTopColor: borderColor }}
    >
      {scenario && (
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: '#3A3B4D', letterSpacing: '0.08em' }}
        >
          {scenario}
        </span>
      )}
      <p className="text-sm font-medium mt-1" style={{ color: '#3A3B4D' }}>
        {label}
      </p>
      <p className="text-2xl font-bold mt-1" style={{ color: valueColor }}>
        {value}
      </p>
      {sublabel && (
        <p className="text-xs mt-1" style={{ color: '#3A3B4D' }}>
          {sublabel}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
