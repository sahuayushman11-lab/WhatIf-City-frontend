import React, { useState, useEffect } from 'react';
import {
  ScenarioDefinition,
  ScenarioComparisonOutput,
  TrafficSimulationParams,
} from '../types/simulation';
import { apiClient } from '../services/api';
import { DEFAULT_CLIENT_SCENARIOS } from '../services/defaultScenarios';
import { exportComparisonToCSV, triggerPrintReport } from '../utils/exportUtils';
import {
  GitCompare,
  TrendingDown,
  TrendingUp,
  Download,
  Printer,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  BookmarkPlus,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

interface ComparisonPageProps {
  initialScenarioId?: string;
  onOpenInLab: (scenarioId: string) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({
  initialScenarioId = 'traffic-college-gate',
  onOpenInLab,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(initialScenarioId);
  const [objective, setObjective] = useState<
    'minimize_delay' | 'minimize_queue' | 'prioritize_pedestrians' | 'balanced'
  >('balanced');
  const [comparison, setComparison] = useState<ScenarioComparisonOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const scenario: ScenarioDefinition =
    DEFAULT_CLIENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || DEFAULT_CLIENT_SCENARIOS[0];

  useEffect(() => {
    runComparison();
  }, [selectedScenarioId, objective]);

  const runComparison = async () => {
    setLoading(true);
    try {
      const result = await apiClient.compareSimulations({
        baseline: scenario.baselineParameters,
        planA: scenario.defaultPlanA,
        planB: scenario.defaultPlanB,
        names: {
          baseline: scenario.baselineParameters.name,
          planA: scenario.defaultPlanA.name,
          planB: scenario.defaultPlanB.name,
        },
        objective,
      });
      setComparison(result);
    } catch (err) {
      console.error('Comparison error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!comparison) return;
    exportComparisonToCSV(comparison, `${scenario.id}-comparison.csv`);
  };

  const handleSaveProject = async () => {
    try {
      await apiClient.saveProject({
        title: `${scenario.name} Scenario Comparison`,
        description: `Compared Baseline against ${scenario.defaultPlanA.name} and ${scenario.defaultPlanB.name} with objective: ${objective}.`,
        scenariosSnapshot: {
          scenarioId: scenario.id,
          baselineParams: scenario.baselineParameters,
          planAParams: scenario.defaultPlanA,
          planBParams: scenario.defaultPlanB,
        },
      });
      setSaveSuccessMessage('Project successfully saved to project manager!');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (e) {
      console.error('Failed to save project', e);
    }
  };

  // Recharts Multi-Bar Comparison Data
  const barChartData = comparison
    ? [
        {
          metric: 'Avg Delay (s/veh)',
          Baseline: comparison.baseline.kpis.avgDelayPerVehicleSeconds,
          'Plan A': comparison.planA.kpis.avgDelayPerVehicleSeconds,
          'Plan B': comparison.planB.kpis.avgDelayPerVehicleSeconds,
        },
        {
          metric: 'Max Queue (veh)',
          Baseline: comparison.baseline.kpis.maxQueueLength,
          'Plan A': comparison.planA.kpis.maxQueueLength,
          'Plan B': comparison.planB.kpis.maxQueueLength,
        },
        {
          metric: 'Throughput (veh/h ÷ 10)',
          Baseline: Math.round(comparison.baseline.kpis.throughputPerHour / 10),
          'Plan A': Math.round(comparison.planA.kpis.throughputPerHour / 10),
          'Plan B': Math.round(comparison.planB.kpis.throughputPerHour / 10),
        },
        {
          metric: 'Remaining Queue (veh)',
          Baseline: comparison.baseline.kpis.remainingQueue,
          'Plan A': comparison.planA.kpis.remainingQueue,
          'Plan B': comparison.planB.kpis.remainingQueue,
        },
      ]
    : [];

  // Merged Queue over time data for 3 plans
  const queueOverlayData = React.useMemo(() => {
    if (!comparison) return [];
    const baseSteps = comparison.baseline.timeSeries;
    const aSteps = comparison.planA.timeSeries;
    const bSteps = comparison.planB.timeSeries;

    return baseSteps.map((bStep, idx) => ({
      timeLabel: bStep.timeLabel,
      'Baseline Queue': bStep.queueLength,
      'Plan A Queue': aSteps[idx]?.queueLength ?? bStep.queueLength,
      'Plan B Queue': bSteps[idx]?.queueLength ?? bStep.queueLength,
    }));
  }, [comparison]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Printable Header (Visible only when printing) */}
      <div className="print-only mb-6 border-b pb-4">
        <h1 className="text-xl font-bold">WhatIf City &bull; Scenario Comparison Report</h1>
        <p className="text-xs text-gray-600">
          Generated: {new Date().toLocaleDateString()} &bull; Scenario: {scenario.name} &bull; Model: {scenario.modelVersion}
        </p>
      </div>

      {/* Top Header */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Multi-Scenario Comparison
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-[11px] font-mono text-slate-500">Side-by-Side Trade-off Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">{scenario.name}</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{scenario.description}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <select
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {DEFAULT_CLIENT_SCENARIOS.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Download CSV table"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={triggerPrintReport}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Print or Save PDF report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleSaveProject}
            className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save Project</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Configurable Objective Selector */}
      <div className="no-print p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Evaluation Objective &amp; Weighted Scoring
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Formulas and weights are fully disclosed below &bull; Safety is never masked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'balanced', label: 'Balanced Evaluation', desc: '40% Delay, 30% Queue, 30% Pedestrians' },
            { id: 'minimize_delay', label: 'Minimize Vehicle Delay', desc: '70% Delay, 20% Queue, 10% Ped' },
            { id: 'minimize_queue', label: 'Minimize Queue Spillback', desc: '70% Queue, 20% Delay, 10% Ped' },
            { id: 'prioritize_pedestrians', label: 'Prioritize Pedestrian Access', desc: '60% Ped Walk, 20% Delay, 20% Queue' },
          ].map((obj) => (
            <button
              key={obj.id}
              onClick={() => setObjective(obj.id as any)}
              className={`p-2.5 rounded-xl text-left border transition ${
                objective === obj.id
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-950 dark:text-teal-200 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{obj.label}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{obj.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs text-slate-400">Computing scenario deltas...</span>
        </div>
      ) : !comparison ? (
        <div className="p-8 text-center text-slate-500">Failed to load comparison data.</div>
      ) : (
        <div className="space-y-8">
          {/* Objective Composite Scores Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Baseline (Status Quo)
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                {comparison.objectiveScores.scores.baseline}
                <span className="text-xs text-slate-400 font-normal ml-1">/ 100</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Level of Service: <strong>{comparison.baseline.kpis.levelOfService}</strong>
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/80 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                  {comparison.planA.scenarioName}
                </span>
                <span className="text-[10px] font-semibold bg-teal-200/60 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded-full">
                  Plan A
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-teal-700 dark:text-teal-300">
                {comparison.objectiveScores.scores.planA}
                <span className="text-xs text-teal-600/70 font-normal ml-1">/ 100</span>
              </div>
              <p className="text-xs text-teal-800 dark:text-teal-300">
                Level of Service: <strong>{comparison.planA.kpis.levelOfService}</strong> &bull; Delay:{' '}
                {comparison.planA.kpis.avgDelayPerVehicleSeconds}s
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  {comparison.planB.scenarioName}
                </span>
                <span className="text-[10px] font-semibold bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Plan B
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                {comparison.objectiveScores.scores.planB}
                <span className="text-xs text-emerald-600/70 font-normal ml-1">/ 100</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Level of Service: <strong>{comparison.planB.kpis.levelOfService}</strong> &bull; Scramble Crosswalk Active
              </p>
            </div>
          </div>

          {/* Side-by-Side Detailed KPI Diff Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Detailed Indicator Comparison &amp; Relative Changes (&Delta; / &Delta;%)
              </h3>
              <span className="text-[11px] text-slate-400">Green = Desirable direction</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Metric &amp; Unit</th>
                    <th className="py-3 px-3">Preferred</th>
                    <th className="py-3 px-3">Baseline</th>
                    <th className="py-3 px-3">Plan A</th>
                    <th className="py-3 px-3">Plan A &Delta; (%)</th>
                    <th className="py-3 px-3">Plan B</th>
                    <th className="py-3 px-3">Plan B &Delta; (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {comparison.differencesPlanA.map((diffA) => {
                    const diffB = comparison.differencesPlanB.find((d) => d.metricKey === diffA.metricKey);
                    return (
                      <tr key={diffA.metricKey} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {diffA.metricLabel}
                          <span className="text-[10px] text-slate-400 block font-mono">{diffA.unit}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {diffA.preferredDirection === 'lower' ? '↓ Lower' : '↑ Higher'}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {diffA.baselineValue}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">{diffA.planValue}</td>
                        <td className="py-3 px-3 font-mono text-xs">
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-semibold ${
                              diffA.isImprovement
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {diffA.absoluteChange > 0 ? `+${diffA.absoluteChange}` : diffA.absoluteChange}
                            {diffA.percentageChange !== null ? ` (${diffA.percentageChange}%)` : ' (N/A)'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">
                          {diffB ? diffB.planValue : 'N/A'}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs">
                          {diffB ? (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-semibold ${
                                diffB.isImprovement
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {diffB.absoluteChange > 0 ? `+${diffB.absoluteChange}` : diffB.absoluteChange}
                              {diffB.percentageChange !== null ? ` (${diffB.percentageChange}%)` : ' (N/A)'}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Charts: Bar Comparison & Line Overlay */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart KPIs */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Comparative Key Performance Indicators
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="metric" tick={{ fontSize: 10 }} stroke="#94a3b8" />
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
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Plan A" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Plan B" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart Queue Progression Overlay */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Queue Length Progression Over Time (Vehicles)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={queueOverlayData}>
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
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey="Baseline Queue" stroke="#64748b" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="Plan A Queue" stroke="#0d9488" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Plan B Queue" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Trade-Off Matrix Callouts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Explicit Policy Trade-Offs &amp; Multi-Dimensional Impacts
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Urban planning rarely offers a single universally superior scenario without trade-offs. Review the
              competing dimensions below:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {comparison.tradeOffs.map((trade, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{trade.dimension}</span>
                    <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                      Advantage: {trade.winner}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{trade.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exact Input Assumptions Table */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Exact Input Assumptions Matrix</h4>
              <span className="text-[11px] text-slate-400">Fixed simulation units</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                    <th className="py-2">Parameter</th>
                    <th className="py-2">Baseline</th>
                    <th className="py-2">Plan A</th>
                    <th className="py-2">Plan B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2">Arrival Rate (&lambda;)</td>
                    <td className="py-2">{scenario.baselineParameters.arrivalRateVehiclesPerMin} veh/min</td>
                    <td className="py-2">{scenario.defaultPlanA.arrivalRateVehiclesPerMin} veh/min</td>
                    <td className="py-2">{scenario.defaultPlanB.arrivalRateVehiclesPerMin} veh/min</td>
                  </tr>
                  <tr>
                    <td className="py-2">Discharge Saturation Flow (s)</td>
                    <td className="py-2">{scenario.baselineParameters.dischargeRateVehiclesPerMin} veh/min</td>
                    <td className="py-2">{scenario.defaultPlanA.dischargeRateVehiclesPerMin} veh/min</td>
                    <td className="py-2">{scenario.defaultPlanB.dischargeRateVehiclesPerMin} veh/min</td>
                  </tr>
                  <tr>
                    <td className="py-2">Signal Cycle (C)</td>
                    <td className="py-2">{scenario.baselineParameters.signalCycleLengthSeconds}s</td>
                    <td className="py-2">{scenario.defaultPlanA.signalCycleLengthSeconds}s</td>
                    <td className="py-2">{scenario.defaultPlanB.signalCycleLengthSeconds}s</td>
                  </tr>
                  <tr>
                    <td className="py-2">Effective Green (g)</td>
                    <td className="py-2">{scenario.baselineParameters.effectiveGreenTimeSeconds}s</td>
                    <td className="py-2">{scenario.defaultPlanA.effectiveGreenTimeSeconds}s</td>
                    <td className="py-2">{scenario.defaultPlanB.effectiveGreenTimeSeconds}s</td>
                  </tr>
                  <tr>
                    <td className="py-2">Pedestrian Walk Phase</td>
                    <td className="py-2">{scenario.baselineParameters.pedestrianCrossingDurationSeconds}s</td>
                    <td className="py-2">{scenario.defaultPlanA.pedestrianCrossingDurationSeconds}s</td>
                    <td className="py-2">{scenario.defaultPlanB.pedestrianCrossingDurationSeconds}s (Scramble)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-500 pt-1 italic">{comparison.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
