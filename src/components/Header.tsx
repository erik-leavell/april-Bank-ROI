import React from 'react';

interface HeaderProps {
  bankName: string;
}

const Header: React.FC<HeaderProps> = ({ bankName }) => {
  return (
    <header
      className="px-8 py-4 flex items-center justify-between relative overflow-hidden"
      style={{ backgroundColor: '#210F4B' }}
    >
      {/* Concentric circle arcs — brand signature element */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1600 120"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="1400" cy="60" r="80" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx="1400" cy="60" r="140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <circle cx="1400" cy="60" r="200" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="1400" cy="60" r="260" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      </svg>
      <div className="flex items-center gap-4 relative z-10">
        <span
          className="text-2xl font-bold tracking-tight text-white"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          april
        </span>
        <span className="text-lg font-light text-white" style={{ opacity: 0.4 }}>|</span>
        <span
          className="text-base font-medium text-white"
          style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif", opacity: 0.85 }}
        >
          Bank ROI Model
        </span>
      </div>
      <div className="text-sm font-medium text-white relative z-10" style={{ opacity: 0.7 }}>
        {bankName !== '[Your Bank]' ? bankName : ''}
      </div>
    </header>
  );
};

export default Header;
