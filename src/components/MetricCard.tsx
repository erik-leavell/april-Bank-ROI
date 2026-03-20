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
      ? '#135948'
      : variant === 'negative'
      ? '#893326'
      : '#5E00FF';

  const valueColor =
    variant === 'positive'
      ? '#135948'
      : variant === 'negative'
      ? '#893326'
      : '#1a1a2e';

  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm border-t-4"
      style={{ borderTopColor: borderColor }}
    >
      {scenario && (
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475464' }}>
          {scenario}
        </span>
      )}
      <p className="text-sm font-medium mt-1" style={{ color: '#475464' }}>
        {label}
      </p>
      <p className="text-2xl font-bold mt-1" style={{ color: valueColor }}>
        {value}
      </p>
      {sublabel && (
        <p className="text-xs mt-1" style={{ color: '#475464' }}>
          {sublabel}
        </p>
      )}
    </div>
  );
};

export default MetricCard;
