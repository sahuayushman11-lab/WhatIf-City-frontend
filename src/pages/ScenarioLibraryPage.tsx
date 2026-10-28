import React, { useState, useEffect } from 'react';
import { ScenarioDefinition } from '../types/simulation';
import { apiClient } from '../services/api';
import { Search, Filter, Sliders, GitCompare, Info, PlusCircle, AlertCircle, X, Check } from 'lucide-react';

interface ScenarioLibraryPageProps {
  onSelectScenario: (scenarioId: string) => void;
  onCompareScenario: (scenarioId: string) => void;
}

export const ScenarioLibraryPage: React.FC<ScenarioLibraryPageProps> = ({
  onSelectScenario,
  onCompareScenario,
}) => {
  const [scenarios, setScenarios] = useState<ScenarioDefinition[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeLimitationModal, setActiveLimitationModal] = useState<ScenarioDefinition | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Template Form State
  const [newScenarioName, setNewScenarioName] = useState('South Campus Shuttle & Gate');
  const [newCategory, setNewCategory] = useState<'traffic' | 'pedestrian' | 'parking' | 'transit'>('traffic');
  const [newArrivalRate, setNewArrivalRate] = useState(25);
  const [newGreenTime, setNewGreenTime] = useState(35);
  const [newCycle, setNewCycle] = useState(80);

  useEffect(() => {
    loadScenarios();
  }, [category, search]);

  const loadScenarios = async () => {
    setLoading(true);
    const data = await apiClient.getScenarios(category, search);
    setScenarios(data);
    setLoading(false);
  };

  const categories = [
    { id: 'all', label: 'All Scenarios' },
    { id: 'traffic', label: 'Traffic Intersections' },
    { id: 'pedestrian', label: 'Pedestrian Crossings' },
    { id: 'parking', label: 'Parking Demand' },
    { id: 'transit', label: 'Campus Shuttles' },
    { id: 'one-way', label: 'One-Way Corridors' },
  ];

  const handleCreateTemplate = () => {
    const templateScenario: ScenarioDefinition = {
      id: 'custom-' + Date.now(),
      name: newScenarioName,
      category: newCategory,
      description: `Custom scenario created from template for ${newCategory} simulation.`,
      locationType: 'Configured Urban Intersection',
      dataSource: 'user_configured',
      modelVersion: 'v1.0.0-discrete-queue',
      visibility: 'public',
      coordinates: [37.775, -122.418],
      knownLimitations: ['Educational discrete-time model.'],
      inputParameters: {
        arrivalRateVehiclesPerMin: newArrivalRate,
        initialQueueVehicles: 8,
        dischargeRateVehiclesPerMin: 30,
        signalCycleLengthSeconds: newCycle,
        effectiveGreenTimeSeconds: newGreenTime,
        amberAndAllRedSeconds: 4,
        pedestrianCrossingDurationSeconds: 20,
        simulationDurationMinutes: 20,
        randomSeed: 42,
      },
      baselineParameters: {
        name: 'Baseline',
        arrivalRateVehiclesPerMin: newArrivalRate,
        initialQueueVehicles: 8,
        dischargeRateVehiclesPerMin: 30,
        signalCycleLengthSeconds: newCycle,
        effectiveGreenTimeSeconds: newGreenTime,
        amberAndAllRedSeconds: 4,
        pedestrianCrossingDurationSeconds: 20,
        simulationDurationMinutes: 20,
      },
      defaultPlanA: {
        name: 'Plan A: Extended Green (+10s)',
        arrivalRateVehiclesPerMin: newArrivalRate,
        initialQueueVehicles: 8,
        dischargeRateVehiclesPerMin: 32,
        signalCycleLengthSeconds: newCycle,
        effectiveGreenTimeSeconds: Math.min(newCycle - 4, newGreenTime + 10),
        amberAndAllRedSeconds: 4,
        pedestrianCrossingDurationSeconds: 20,
        simulationDurationMinutes: 20,
      },
      defaultPlanB: {
        name: 'Plan B: Dedicated Scramble Phase',
        arrivalRateVehiclesPerMin: newArrivalRate,
        initialQueueVehicles: 8,
        dischargeRateVehiclesPerMin: 36,
        signalCycleLengthSeconds: newCycle + 15,
        effectiveGreenTimeSeconds: newGreenTime,
        amberAndAllRedSeconds: 4,
        pedestrianCrossingDurationSeconds: 25,
        exclusivePedestrianPhase: true,
        simulationDurationMinutes: 20,
      },
    };

    setScenarios([templateScenario, ...scenarios]);
    setShowTemplateModal(false);
    onSelectScenario(templateScenario.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Urban Scenario Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose an illustrative baseline scenario, inspect assumptions, or instantiate a custom template.
          </p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 self-start md:self-auto transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create from Template</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                category === c.id
                  ? 'bg-teal-600 text-white font-semibold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scenarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Scenario Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs text-slate-400">Loading scenarios...</span>
        </div>
      ) : scenarios.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No scenarios found</h3>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filter category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    {sc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {sc.modelVersion}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{sc.name}</h3>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{sc.locationType}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {sc.description}
                </p>

                {/* Available Parameters & Metrics Box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-mono">
                    <span>Arrival Demand:</span>
                    <strong>{sc.inputParameters.arrivalRateVehiclesPerMin} veh/min</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-mono">
                    <span>Discharge Rate:</span>
                    <strong>{sc.inputParameters.dischargeRateVehiclesPerMin} veh/min</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-mono">
                    <span>Cycle &bull; Green:</span>
                    <strong>
                      {sc.inputParameters.signalCycleLengthSeconds}s &bull; {sc.inputParameters.effectiveGreenTimeSeconds}s
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 font-mono">
                    <span>Expected Metrics:</span>
                    <strong className="text-teal-600 dark:text-teal-400">Queue, Delay, LOS</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    Data: Synthetic Demo
                  </span>
                  <button
                    onClick={() => setActiveLimitationModal(sc)}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline flex items-center gap-0.5"
                  >
                    <Info className="w-3 h-3" />
                    <span>Limitations</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onSelectScenario(sc.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Open in Lab</span>
                  </button>
                  <button
                    onClick={() => onCompareScenario(sc.id)}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                    title="Compare Plans A & B"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Limitations Modal */}
      {activeLimitationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-teal-600" />
                <span>Model Limitations &amp; Assumptions</span>
              </h3>
              <button
                onClick={() => setActiveLimitationModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Scenario:</strong> {activeLimitationModal.name}
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-semibold block">Educational Scope Disclaimer</span>
                <p>
                  This model uses macroscopic queueing approximations. Results are conditional estimates to explore
                  hypothetical policy trade-offs, not certified blueprints.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">Known Limitations:</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400">
                  {activeLimitationModal.knownLimitations?.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  )) || <li>Single aggregated FIFO approach model.</li>}
                  <li>Assumes uniform vehicle lengths and ideal pavement friction conditions.</li>
                  <li>Pedestrian conflict delay uses statistical compliance yield factors.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setActiveLimitationModal(null)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Template Creator Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                <span>Instantiate Scenario from Template</span>
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Scenario Title
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="traffic">Traffic Intersection</option>
                  <option value="pedestrian">Pedestrian Crossing</option>
                  <option value="parking">Parking Demand</option>
                  <option value="transit">Campus Shuttle</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Arrival (&lambda;)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    value={newArrivalRate}
                    onChange={(e) => setNewArrivalRate(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cycle (C)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="180"
                    value={newCycle}
                    onChange={(e) => setNewCycle(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Green (g)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={newCycle - 4}
                    value={newGreenTime}
                    onChange={(e) => setNewGreenTime(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="w-1/2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm"
              >
                Create &amp; Open
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
