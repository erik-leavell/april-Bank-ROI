import React, { useState, useRef, useEffect } from 'react';
import { SourceInfo } from '../sourceMeta';

interface SourceTooltipProps {
  info: SourceInfo;
}

// Source type → color mapping (brand palette)
const SOURCE_COLORS: Record<string, string> = {
  'Bank data': '#210F4B',
  'Bank treasury': '#210F4B',
  'Bank decision': '#210F4B',
  Contract: '#5E00FF',
  IRS: '#3A3B4D',
  'Public data': '#3A3B4D',
  BLS: '#3A3B4D',
  'JPMC Institute': '#1A2040',
  'Javelin / Fintech': '#1A2040',
  'CFPB / Industry': '#1A2040',
  'Industry data': '#1A2040',
  'Market data': '#1A2040',
  McKinsey: '#1A2040',
  'ABA / Bain': '#1A2040',
  'Lender data': '#1A2040',
  Estimate: '#7B5CFF',
  Timing: '#7B5CFF',
  Sales: '#5E00FF',
};

const SourceTooltip: React.FC<SourceTooltipProps> = ({ info }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const pillColor = SOURCE_COLORS[info.source] || '#7B5CFF';

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center justify-center rounded-full transition-all"
        style={{
          width: 16,
          height: 16,
          fontSize: '0.6rem',
          fontWeight: 700,
          color: open ? '#fff' : '#CBC9E6',
          backgroundColor: open ? '#7B5CFF' : 'transparent',
          border: `1.5px solid ${open ? '#7B5CFF' : '#CBC9E6'}`,
          lineHeight: 1,
        }}
        title="View source"
      >
        ?
      </button>

      {open && (
        <div
          className="absolute z-50 rounded-lg shadow-lg border"
          style={{
            bottom: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 280,
            backgroundColor: '#fff',
            borderColor: '#EAEBED',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 12,
              height: 12,
              backgroundColor: '#fff',
              border: '1px solid #EAEBED',
              borderTop: 'none',
              borderLeft: 'none',
              rotate: '45deg',
            }}
          />

          <div className="p-3 relative" style={{ zIndex: 1, backgroundColor: '#fff', borderRadius: 8 }}>
            {/* Source pill */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#3A3B4D', fontSize: '0.6rem', letterSpacing: '0.1em' }}
              >
                Source
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: pillColor, fontSize: '0.65rem' }}
              >
                {info.source}
              </span>
            </div>

            {/* Detail */}
            <p
              className="text-xs leading-relaxed"
              style={{ color: '#3A3B4D', fontSize: '0.72rem' }}
            >
              {info.detail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceTooltip;
