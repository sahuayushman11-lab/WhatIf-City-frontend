import React from 'react';
import { TrafficSimulationParams } from '../../types/simulation';
import { RotateCcw, Play, AlertCircle, Info, Sparkles } from 'lucide-react';

interface LiveControlsProps {
  params: TrafficSimulationParams;
  onChange: (updated: TrafficSimulationParams) => void;
  onReset: () => void;
  onRun: () => void;
  isRunning?: boolean;
  validationError?: string | null;
}

export const LiveControls: React.FC<LiveControlsProps> = ({
  params,
  onChange,
  onReset,
  onRun,
  isRunning = false,
  validationError,
}) => {
  const updateParam = (key: keyof TrafficSimulationParams, value: any) => {
    onChange({
      ...params,
      [key]: value,
    });
  };

  const yellow = params.amberAndAllRedSeconds ?? 4;
  const cycle = params.signalCycleLengthSeconds;
  const green = params.effectiveGreenTimeSeconds;
  const ped = params.pedestrianCrossingDurationSeconds;
  const isExclusive = !!params.exclusivePedestrianPhase;

  // Signal timing calculation & validation
  const redTime = Math.max(0, cycle - green - yellow);
  const greenPct = Math.round((green / cycle) * 100);
  const yellowPct = Math.round((yellow / cycle) * 100);
  const redPct = Math.max(0, 100 - greenPct - yellowPct);

  const isTimingInfeasible = green + yellow > cycle;
  const isPedInfeasible = isExclusive && green + yellow + ped > cycle;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>⚙️ Parameter Controls</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjust inputs below to simulate altered signal timings & arrival volumes.
          </p>
        </div>
        <button
          onClick={onReset}
          type="button"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1.5 rounded-lg transition"
          title="Reset to scenario baseline defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Real-time validation warning alert */}
      {(validationError || isTimingInfeasible || isPedInfeasible) && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
          <div className="space-y-1">
            <span className="font-semibold block">Infeasible Timing Combination</span>
            <p className="text-[11px] leading-relaxed">
              {validationError ||
                (isTimingInfeasible
                  ? `Effective Green (${green}s) + Clearance (${yellow}s) = ${green + yellow}s, which exceeds Cycle Length (${cycle}s). Reduce green or increase cycle.`
                  : `Exclusive pedestrian phase requires Green (${green}s) + Clearance (${yellow}s) + Ped Walk (${ped}s) ≤ Cycle (${cycle}s). Current sum: ${green + yellow + ped}s.`)}
            </p>
          </div>
        </div>
      )}

      {/* Visual Phase Split Bar */}
      <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-slate-700 dark:text-slate-300">Signal Cycle Distribution</span>
          <span className="text-[11px] text-slate-500 font-mono">
            {green}s Green &bull; {yellow}s Yellow &bull; {redTime}s Red
          </span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
          <div
            style={{ width: `${greenPct}%` }}
            className="bg-emerald-500 transition-all duration-300"
            title={`Green: ${green}s (${greenPct}%)`}
          />
          <div
            style={{ width: `${yellowPct}%` }}
            className="bg-amber-400 transition-all duration-300"
            title={`Yellow: ${yellow}s (${yellowPct}%)`}
          />
          <div
            style={{ width: `${redPct}%` }}
            className="bg-rose-500 transition-all duration-300"
            title={`Red: ${redTime}s (${redPct}%)`}
          />
        </div>
      </div>

      {/* Control Groups Grid */}
      <div className="space-y-4">
        {/* Arrival Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1">
              Traffic Arrival Rate (&lambda;)
              <span className="text-slate-400 text-[10px] font-normal">(veh/min)</span>
            </label>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
              {params.arrivalRateVehiclesPerMin}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="100"
              value={params.arrivalRateVehiclesPerMin}
              onChange={(e) => updateParam('arrivalRateVehiclesPerMin', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <input
              type="number"
              min="1"
              max="100"
              value={params.arrivalRateVehiclesPerMin}
              onChange={(e) => updateParam('arrivalRateVehiclesPerMin', Math.max(1, Number(e.target.value)))}
              className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Discharge Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1">
              Discharge Rate (Saturation Flow)
              <span className="text-slate-400 text-[10px] font-normal">(veh/min)</span>
            </label>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
              {params.dischargeRateVehiclesPerMin}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="80"
              value={params.dischargeRateVehiclesPerMin}
              onChange={(e) => updateParam('dischargeRateVehiclesPerMin', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <input
              type="number"
              min="5"
              max="80"
              value={params.dischargeRateVehiclesPerMin}
              onChange={(e) => updateParam('dischargeRateVehiclesPerMin', Math.max(5, Number(e.target.value)))}
              className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Signal Cycle Length */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1">
              Signal Cycle Length (C)
              <span className="text-slate-400 text-[10px] font-normal">(seconds)</span>
            </label>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
              {params.signalCycleLengthSeconds}s
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="20"
              max="180"
              step="5"
              value={params.signalCycleLengthSeconds}
              onChange={(e) => updateParam('signalCycleLengthSeconds', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <input
              type="number"
              min="20"
              max="180"
              value={params.signalCycleLengthSeconds}
              onChange={(e) => updateParam('signalCycleLengthSeconds', Math.max(20, Number(e.target.value)))}
              className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Effective Green Time */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1">
              Effective Green Time (g)
              <span className="text-slate-400 text-[10px] font-normal">(seconds)</span>
            </label>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {params.effectiveGreenTimeSeconds}s
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max={params.signalCycleLengthSeconds - yellow}
              value={params.effectiveGreenTimeSeconds}
              onChange={(e) => updateParam('effectiveGreenTimeSeconds', Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <input
              type="number"
              min="5"
              max={params.signalCycleLengthSeconds}
              value={params.effectiveGreenTimeSeconds}
              onChange={(e) => updateParam('effectiveGreenTimeSeconds', Math.max(5, Number(e.target.value)))}
              className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Pedestrian Crossing Duration */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1">
              Pedestrian Crossing Walk Interval
              <span className="text-slate-400 text-[10px] font-normal">(seconds)</span>
            </label>
            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
              {params.pedestrianCrossingDurationSeconds}s
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="60"
              value={params.pedestrianCrossingDurationSeconds}
              onChange={(e) => updateParam('pedestrianCrossingDurationSeconds', Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <input
              type="number"
              min="5"
              max="60"
              value={params.pedestrianCrossingDurationSeconds}
              onChange={(e) => updateParam('pedestrianCrossingDurationSeconds', Math.max(5, Number(e.target.value)))}
              className="w-16 px-2 py-1 text-xs font-mono text-center rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Advanced Toggles */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={!!params.exclusivePedestrianPhase}
              onChange={(e) => updateParam('exclusivePedestrianPhase', e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Dedicated Pedestrian Scramble Phase (All vehicular red)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={!!params.useStochasticArrivals}
              onChange={(e) => updateParam('useStochasticArrivals', e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Stochastic Seeded Arrivals (Poisson arrival noise)</span>
          </label>
        </div>

        {/* Initial Queue & Duration */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Initial Queue (veh)
            </label>
            <input
              type="number"
              min="0"
              max="200"
              value={params.initialQueueVehicles}
              onChange={(e) => updateParam('initialQueueVehicles', Math.max(0, Number(e.target.value)))}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Duration (mins)
            </label>
            <input
              type="number"
              min="5"
              max="120"
              step="5"
              value={params.simulationDurationMinutes}
              onChange={(e) => updateParam('simulationDurationMinutes', Math.max(5, Number(e.target.value)))}
              className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onRun}
        disabled={isRunning || isTimingInfeasible || isPedInfeasible}
        className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
          isRunning || isTimingInfeasible || isPedInfeasible
            ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20 hover:shadow-teal-500/30 active:scale-[0.98]'
        }`}
      >
        {isRunning ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Simulating Time Steps...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span>Run Simulation</span>
          </>
        )}
      </button>
    </div>
  );
};
