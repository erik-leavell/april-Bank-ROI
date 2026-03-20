import React from 'react';

export type TabId = 'dashboard' | 'inputs' | 'funnel' | 'valueAreas' | 'costs' | 'scenario';

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inputs', label: 'Inputs' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'valueAreas', label: 'Value Areas' },
  { id: 'costs', label: 'Costs' },
  { id: 'scenario', label: 'Scenario Comparison' },
];

const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6">
      <div className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#5E00FF]'
                : 'text-[#475464] hover:text-[#5E00FF]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5E00FF] rounded-t" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNav;
