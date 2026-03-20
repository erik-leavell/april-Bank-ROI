import React from 'react';

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  format?: 'percent' | 'currency' | 'number' | 'decimal';
  locked?: boolean;
  highlight?: 'bank' | 'editable' | 'locked';
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = 'number',
  locked = false,
  highlight = 'editable',
}) => {
  // Brand-approved colors only
  const bgColor =
    highlight === 'bank'
      ? '#EAEBED'           // Light Gray for bank inputs
      : highlight === 'locked'
      ? '#EAEBED'           // Light Gray for locked
      : 'rgba(94, 0, 255, 0.04)'; // Very subtle Grapril tint for editable

  const borderColor =
    highlight === 'bank'
      ? '#CBC9E6'           // Light Lilac border for bank
      : highlight === 'locked'
      ? '#CBC9E6'           // Light Lilac border for locked
      : '#CBC9E6';          // Light Lilac border for editable

  const displayValue = () => {
    if (format === 'percent') {
      const pctVal = value * 100;
      const decimals = step < 0.001 ? 3 : step < 0.01 ? 2 : 1;
      return pctVal.toFixed(decimals);
    }
    if (format === 'currency') return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (format === 'decimal') return value.toFixed(2);
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  const parseInput = (raw: string): number => {
    const cleaned = raw.replace(/[,$%\s]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return value;
    if (format === 'percent') return num / 100;
    return num;
  };

  const sliderValue = format === 'percent' ? value * 100 : value;
  const sliderMin = format === 'percent' ? min * 100 : min;
  const sliderMax = format === 'percent' ? max * 100 : max;
  const sliderStep = format === 'percent' ? step * 100 : step;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: '#3A3B4D' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        {!locked && (
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={sliderValue}
            onChange={(e) => {
              const raw = parseFloat(e.target.value);
              onChange(format === 'percent' ? raw / 100 : raw);
            }}
            className="flex-1 min-w-0"
          />
        )}
        <div
          className="flex items-center rounded-md border py-1.5 text-sm font-medium min-w-[90px]"
          style={{ backgroundColor: bgColor, borderColor }}
        >
          {format === 'currency' && !locked && (
            <span className="pl-2 text-xs shrink-0" style={{ color: '#3A3B4D' }}>
              $
            </span>
          )}
          {locked ? (
            <span className="w-full text-right px-3" style={{ color: '#3A3B4D' }}>
              {format === 'currency' && <span>$</span>}
              {format === 'percent'
                ? `${(value * 100).toFixed(1)}%`
                : format === 'currency'
                ? value.toLocaleString()
                : value}
            </span>
          ) : (
            <input
              type="text"
              value={displayValue()}
              onChange={(e) => {
                const parsed = parseInput(e.target.value);
                onChange(Math.min(Math.max(parsed, min), max));
              }}
              className="flex-1 min-w-0 bg-transparent text-right outline-none text-sm font-medium"
              style={{ color: '#1A2040', paddingLeft: format === 'currency' ? '0' : '12px', paddingRight: format === 'percent' ? '2px' : '12px' }}
            />
          )}
          {format === 'percent' && !locked && (
            <span className="pr-2 text-xs font-semibold shrink-0" style={{ color: '#3A3B4D' }}>
              %
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;
