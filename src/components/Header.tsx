import React from 'react';

interface HeaderProps {
  bankName: string;
}

const Header: React.FC<HeaderProps> = ({ bankName }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-3xl font-extrabold tracking-tight" style={{ color: '#5E00FF' }}>
          april
        </span>
        <span className="text-xl font-semibold text-gray-500">|</span>
        <span className="text-lg font-semibold" style={{ color: '#475464' }}>
          Bank ROI Model
        </span>
      </div>
      <div className="text-sm font-medium" style={{ color: '#475464' }}>
        {bankName !== '[Your Bank]' ? bankName : ''}
      </div>
    </header>
  );
};

export default Header;
