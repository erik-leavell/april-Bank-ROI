import React, { useState, useMemo } from 'react';
import { AllInputs, ScenarioInputs, ScenarioKey } from './types';
import { DEFAULT_INPUTS } from './constants';
import { calculateScenario } from './calculations';
import Header from './components/Header';
import TabNav, { TabId } from './components/TabNav';
import Dashboard from './components/Dashboard';
import InputsPanel from './components/InputsPanel';
import FunnelPanel from './components/FunnelPanel';
import ValueAreasPanel from './components/ValueAreasPanel';
import CostsPanel from './components/CostsPanel';
import ScenarioPanel from './components/ScenarioPanel';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<AllInputs>(() => structuredClone(DEFAULT_INPUTS));
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('base');

  const results = useMemo(
    () => ({
      bear: calculateScenario(inputs.bear),
      base: calculateScenario(inputs.base),
      bull: calculateScenario(inputs.bull),
    }),
    [inputs]
  );

  const handleInputChange = (
    scenario: ScenarioKey,
    field: keyof ScenarioInputs,
    value: number | string | boolean
  ) => {
    setInputs((prev) => ({
      ...prev,
      [scenario]: {
        ...prev[scenario],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    setInputs(structuredClone(DEFAULT_INPUTS));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header bankName={inputs.base.bankName} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            results={results}
            activeScenario={activeScenario}
            onScenarioChange={setActiveScenario}
          />
        )}
        {activeTab === 'inputs' && (
          <InputsPanel
            inputs={inputs}
            onInputChange={handleInputChange}
            onReset={handleReset}
          />
        )}
        {activeTab === 'funnel' && (
          <FunnelPanel results={results} activeScenario={activeScenario} />
        )}
        {activeTab === 'valueAreas' && (
          <ValueAreasPanel results={results} activeScenario={activeScenario} />
        )}
        {activeTab === 'costs' && (
          <CostsPanel results={results} activeScenario={activeScenario} />
        )}
        {activeTab === 'scenario' && <ScenarioPanel results={results} />}
      </main>

      <footer className="border-t border-gray-200 bg-white px-6 py-3 text-center">
        <span className="text-xs" style={{ color: '#475464' }}>
          Powered by{' '}
          <span className="font-bold" style={{ color: '#5E00FF' }}>
            April
          </span>{' '}
          | Confidential
        </span>
      </footer>
    </div>
  );
};

export default App;
