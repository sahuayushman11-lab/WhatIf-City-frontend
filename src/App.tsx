import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { ScenarioLibraryPage } from './pages/ScenarioLibraryPage';
import { SimulationLabPage } from './pages/SimulationLabPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MethodologyPage } from './pages/MethodologyPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('traffic-college-gate');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => {
    setIsDark(!isDark);
  };

  const handleStartSimulation = (scenarioId = 'traffic-college-gate') => {
    setSelectedScenarioId(scenarioId);
    setActiveTab('simulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenComparison = (scenarioId = 'traffic-college-gate') => {
    setSelectedScenarioId(scenarioId);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isDark={isDark}
        toggleDark={toggleDark}
      />

      <main className="flex-1">
        {activeTab === 'overview' && (
          <LandingPage
            onStartSimulation={handleStartSimulation}
            onExploreScenarios={() => setActiveTab('explore')}
            onCompareScenarios={() => handleOpenComparison()}
          />
        )}

        {activeTab === 'explore' && (
          <ScenarioLibraryPage
            onSelectScenario={(id) => handleStartSimulation(id)}
            onCompareScenario={(id) => handleOpenComparison(id)}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationLabPage
            initialScenarioId={selectedScenarioId}
            onNavigateCompare={(id) => handleOpenComparison(id)}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonPage
            initialScenarioId={selectedScenarioId}
            onOpenInLab={(id) => handleStartSimulation(id)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsPage
            onLoadIntoLab={(id) => handleStartSimulation(id)}
            onLoadIntoCompare={(id) => handleOpenComparison(id)}
          />
        )}

        {activeTab === 'methodology' && <MethodologyPage />}
      </main>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
