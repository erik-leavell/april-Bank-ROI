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
  const bgColor =
    highlight === 'bank'
      ? '#FEFBF0'
      : highlight === 'locked'
      ? '#F0EBE3'
      : '#F7F5FB';

  const borderColor =
    highlight === 'bank' ? '#E9CD62' : highlight === 'locked' ? '#d4cfc7' : '#CBC9E6';

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
      <label className="text-xs font-medium" style={{ color: '#475464' }}>
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
          className="relative rounded-md border px-3 py-1.5 text-sm font-medium min-w-[100px] text-right"
          style={{ backgroundColor: bgColor, borderColor }}
        >
          {locked ? (
            <span className="text-gray-600">
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
              className="w-full bg-transparent text-right outline-none text-sm font-medium"
              style={{ color: '#1a1a2e' }}
            />
          )}
          {format === 'percent' && !locked && (
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
              %
            </span>
          )}
          {format === 'currency' && !locked && (
            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
              $
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputField;
