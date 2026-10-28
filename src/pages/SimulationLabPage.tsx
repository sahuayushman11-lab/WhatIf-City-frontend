import React, { useState, useEffect } from 'react';
import {
  TrafficSimulationParams,
  SimulationResult,
  ScenarioDefinition,
} from '../types/simulation';
import { apiClient } from '../services/api';
import { DEFAULT_CLIENT_SCENARIOS } from '../services/defaultScenarios';
import { LiveControls } from '../features/simulation/LiveControls';
import { SchematicIntersection } from '../features/maps/SchematicIntersection';
import { LeafletMap } from '../features/maps/LeafletMap';
import {
  Clock,
  Car,
  TrendingDown,
  AlertTriangle,
  FileText,
  Sliders,
  GitCompare,
  MapPin,
  HelpCircle,
  Activity,
  Layers,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface SimulationLabPageProps {
  initialScenarioId?: string;
  onNavigateCompare: (scenarioId: string) => void;
}

export const SimulationLabPage: React.FC<SimulationLabPageProps> = ({
  initialScenarioId = 'traffic-college-gate',
  onNavigateCompare,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenarioId);
  const [activePlanTab, setActivePlanTab] = useState<'baseline' | 'planA' | 'planB'>('baseline');
  const [activeViewTab, setActiveViewTab] = useState<'schematic' | 'map'>('schematic');

  const scenario: ScenarioDefinition =
    DEFAULT_CLIENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || DEFAULT_CLIENT_SCENARIOS[0];

  // Parameters for the current plan
  const [currentParams, setCurrentParams] = useState<TrafficSimulationParams>({
    ...scenario.baselineParameters,
  });

  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Sync parameters when scenario or plan tab changes
  useEffect(() => {
    let targetParams: TrafficSimulationParams;
    if (activePlanTab === 'baseline') {
      targetParams = { ...scenario.baselineParameters };
    } else if (activePlanTab === 'planA') {
      targetParams = { ...scenario.defaultPlanA };
    } else {
      targetParams = { ...scenario.defaultPlanB };
    }
    setCurrentParams(targetParams);
    runSim(targetParams);
  }, [selectedScenarioId, activePlanTab]);

  const runSim = async (paramsToRun = currentParams) => {
    setIsRunning(true);
    setValidationError(null);
    try {
      const planName =
        activePlanTab === 'baseline'
          ? scenario.baselineParameters.name
          : activePlanTab === 'planA'
          ? scenario.defaultPlanA.name
          : scenario.defaultPlanB.name;

      const res = await apiClient.runSimulation(paramsToRun, planName, scenario.id);
      setSimulationResult(res);
    } catch (err: any) {
      setValidationError(err.message || 'Validation error in simulation parameters.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    let targetParams: TrafficSimulationParams;
    if (activePlanTab === 'baseline') {
      targetParams = { ...scenario.baselineParameters };
    } else if (activePlanTab === 'planA') {
      targetParams = { ...scenario.defaultPlanA };
    } else {
      targetParams = { ...scenario.defaultPlanB };
    }
    setCurrentParams(targetParams);
    runSim(targetParams);
  };

  const getLOSBadgeColor = (los: string) => {
    switch (los) {
      case 'LOS A':
      case 'LOS B':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'LOS C':
      case 'LOS D':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'LOS E':
      case 'LOS F':
      default:
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Scenario Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Interactive Simulation Workspace
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-[11px] font-mono text-slate-500">{scenario.modelVersion}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{scenario.name}</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">{scenario.description}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Switch Scenario dropdown */}
          <div className="relative">
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {DEFAULT_CLIENT_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigateCompare(scenario.id)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition active:scale-95"
            title="Compare Baseline vs Plan A & B side-by-side"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Plans</span>
          </button>
        </div>
      </div>

      {/* Plan Selection Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Configured Condition:</span>
          <button
            onClick={() => setActivePlanTab('baseline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activePlanTab === 'baseline'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Baseline (Status Quo)
          </button>
          <button
            onClick={() => setActivePlanTab('planA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activePlanTab === 'planA'
                ? 'bg-teal-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Proposed Plan A
          </button>
          <button
            onClick={() => setActivePlanTab('planB')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activePlanTab === 'planB'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Proposed Plan B
          </button>
        </div>

        {/* View Switcher: Schematic vs Leaflet Map */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveViewTab('schematic')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              activeViewTab === 'schematic'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🚦 Schematic Visualizer
          </button>
          <button
            onClick={() => setActiveViewTab('map')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              activeViewTab === 'map'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🗺️ OpenStreetMap GIS
          </button>
        </div>
      </div>

      {/* Main Workspace Grid (Left: Parameters, Right: Visualizer & Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <LiveControls
            params={currentParams}
            onChange={setCurrentParams}
            onReset={handleReset}
            onRun={() => runSim(currentParams)}
            isRunning={isRunning}
            validationError={validationError}
          />
        </div>

        {/* Right Column: Visualizer, KPI Stats, and Charts (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Visualizer Panel (Schematic or Map) */}
          {activeViewTab === 'schematic' ? (
            <SchematicIntersection
              queueLength={simulationResult?.kpis.remainingQueue ?? currentParams.initialQueueVehicles}
              isGreen={true}
              pedestrianCrossingActive={!!currentParams.exclusivePedestrianPhase}
              cycleLength={currentParams.signalCycleLengthSeconds}
              greenTime={currentParams.effectiveGreenTimeSeconds}
              scenarioName={scenario.name}
            />
          ) : (
            <LeafletMap
              coordinates={scenario.coordinates}
              scenarioName={scenario.name}
              locationType={scenario.locationType}
            />
          )}

          {/* Results Summary KPI Grid */}
          {simulationResult && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Estimated Performance Indicators
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getLOSBadgeColor(
                      simulationResult.kpis.levelOfService
                    )}`}
                  >
                    {simulationResult.kpis.levelOfService}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (v/c: {simulationResult.kpis.degreeOfSaturation})
                  </span>
                </div>
              </div>

              {/* Warnings callout if oversaturated */}
              {simulationResult.warnings.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="space-y-0.5">
                    {simulationResult.warnings.map((w, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {w}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* 6 Core KPIs Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Average Delay</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {simulationResult.kpis.avgDelayPerVehicleSeconds}
                    <span className="text-xs text-slate-500 font-normal ml-1">s/veh</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Mean waiting time</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Maximum Queue</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {simulationResult.kpis.maxQueueLength}
                    <span className="text-xs text-slate-500 font-normal ml-1">veh</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Peak spillback depth</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Vehicles Served</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {simulationResult.kpis.totalDepartures}
                    <span className="text-xs text-slate-500 font-normal ml-1">veh</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Cleared through green</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Hourly Throughput</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {simulationResult.kpis.throughputPerHour}
                    <span className="text-xs text-slate-500 font-normal ml-1">veh/h</span>
                  </div>
                  <span className="text-[10px] text-slate-400">System discharge capacity</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Remaining Queue</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {simulationResult.kpis.remainingQueue}
                    <span className="text-xs text-slate-500 font-normal ml-1">veh</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Unmet end demand</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Pedestrian Red Wait</span>
                  <div className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400 mt-0.5">
                    {simulationResult.kpis.pedestrianWaitAvgSeconds ?? 35}
                    <span className="text-xs text-slate-500 font-normal ml-1">s</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Average curb wait</span>
                </div>
              </div>

              {/* Time-Series Charts (Recharts) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Queue Progression Over Time (Vehicles vs Seconds)
                  </span>
                  <span className="text-[11px] text-slate-400">Discrete-time steps</span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulationResult.timeSeries}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#f8fafc',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="queueLength"
                        name="Queue Length (veh)"
                        stroke="#0d9488"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="departures"
                        name="Departures per Step"
                        stroke="#6366f1"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Model Assumptions Drawer Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowAssumptions(!showAssumptions)}
                  className="w-full flex items-center justify-between py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-medium">Inspect Documented Model Assumptions</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showAssumptions ? 'rotate-180' : ''}`}
                  />
                </button>

                {showAssumptions && (
                  <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs space-y-2 border border-slate-200/80 dark:border-slate-700 animate-fade-in">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Core Mathematical Assumptions:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {simulationResult.assumptions.map((assump, i) => (
                        <li key={i}>{assump}</li>
                      ))}
                    </ul>
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-700">
                      Execution Timestamp: {simulationResult.executionTimestamp} &bull; Seed: {simulationResult.seedUsed}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
