export function formatCurrency(value: number, abbreviated = false): string {
  if (!isFinite(value)) return '--';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abbreviated) {
    if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
    return `${sign}$${abs.toFixed(0)}`;
  }

  return `${sign}$${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export function formatPercent(value: number, decimals = 1): string {
  if (!isFinite(value)) return '--';
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number, abbreviated = false): string {
  if (!isFinite(value)) return '--';
  if (abbreviated) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(0)}K`;
    return `${sign}${abs.toFixed(0)}`;
  }
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Recharts-compatible tooltip formatter
export function tooltipCurrency(value: unknown): string {
  return formatCurrency(Number(value) || 0, true);
}

export function tooltipNumber(value: unknown): string {
  return formatNumber(Number(value) || 0, true);
}

export function formatMonths(value: number): string {
  if (!isFinite(value) || value < 0) return '--';
  if (value <= 12) return `${value.toFixed(1)} mo`;
  const years = Math.floor(value / 12);
  const months = value % 12;
  return `${years}y ${months.toFixed(0)}mo`;
}
