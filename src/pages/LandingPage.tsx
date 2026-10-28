import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  GitCompare,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Play,
  TrendingDown,
  Car,
  Users,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { DEFAULT_CLIENT_SCENARIOS } from '../services/defaultScenarios';
import { TrafficQueueSimulationEngine } from '../features/simulation/engine/trafficQueue';

interface LandingPageProps {
  onStartSimulation: (scenarioId?: string) => void;
  onExploreScenarios: () => void;
  onCompareScenarios: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulation,
  onExploreScenarios,
  onCompareScenarios,
}) => {
  // Live interactive quick-slider teaser right on hero
  const [quickGreen, setQuickGreen] = useState(30);
  const quickCycle = 90;

  // Run instant calculation for quick teaser
  const quickResult = React.useMemo(() => {
    return TrafficQueueSimulationEngine.run({
      arrivalRateVehiclesPerMin: 28,
      initialQueueVehicles: 12,
      dischargeRateVehiclesPerMin: 30,
      signalCycleLengthSeconds: quickCycle,
      effectiveGreenTimeSeconds: quickGreen,
      amberAndAllRedSeconds: 4,
      pedestrianCrossingDurationSeconds: 20,
      simulationDurationMinutes: 15,
      randomSeed: 42,
    });
  }, [quickGreen]);

  const processSteps = [
    {
      step: '01',
      title: 'Choose a Problem',
      desc: 'Pick from campus gate traffic, pedestrian safety, parking bottlenecks, or shuttle loops.',
      icon: '📍',
    },
    {
      step: '02',
      title: 'Adjust Assumptions',
      desc: 'Tweak signal cycles, green splits, arrival rates, or exclusive scramble crosswalks.',
      icon: '⚙️',
    },
    {
      step: '03',
      title: 'Run Simulation',
      desc: 'Deterministic discrete-time queue physics calculate queue lengths second-by-second.',
      icon: '⏱️',
    },
    {
      step: '04',
      title: 'Compare Outcomes',
      desc: 'Inspect delay reductions, maximum queue spillback, and multi-objective trade-offs.',
      icon: '📊',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-teal-500/15 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Interactive Urban Simulation Platform &bull; Hackathon MVP</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-display leading-[1.15]">
            What If We Changed <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Our City?
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Explore urban ideas, simulate possible outcomes, and compare scenarios before making real-world decisions.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onStartSimulation()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start a Simulation</span>
            </button>
            <button
              onClick={onExploreScenarios}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Example Scenarios</span>
            </button>
          </div>

          {/* Live Interactive Hero Teaser Box */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                    Instant Interactive Teaser
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Slide Green Light Duration &amp; Watch Simulated Delay Respond
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono">
                    Green: <strong className="text-teal-600 dark:text-teal-400">{quickGreen}s</strong> / 90s Cycle
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={quickGreen}
                  onChange={(e) => setQuickGreen(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>15s (Short green)</span>
                  <span>30s (Baseline status quo)</span>
                  <span>45s (Optimized Plan A)</span>
                  <span>60s (Heavy green)</span>
                </div>
              </div>

              {/* Dynamic Output Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Estimated Delay</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {quickResult.kpis.avgDelayPerVehicleSeconds}s
                  </div>
                  <span className="text-[10px] text-slate-400">per arriving car</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Max Queue</span>
                  <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                    {quickResult.kpis.maxQueueLength}
                  </div>
                  <span className="text-[10px] text-slate-400">peak vehicles</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Degree of Saturation</span>
                  <div
                    className={`text-xl font-bold font-mono mt-0.5 ${
                      quickResult.kpis.degreeOfSaturation > 1.0 ? 'text-rose-500' : 'text-emerald-500'
                    }`}
                  >
                    {quickResult.kpis.degreeOfSaturation}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {quickResult.kpis.degreeOfSaturation > 1.0 ? 'Oversaturated' : 'Under capacity'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Level of Service</span>
                  <div
                    className={`text-xl font-bold font-mono mt-0.5 ${
                      quickResult.kpis.levelOfService === 'LOS F'
                        ? 'text-rose-600'
                        : quickResult.kpis.levelOfService === 'LOS A' || quickResult.kpis.levelOfService === 'LOS B'
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {quickResult.kpis.levelOfService}
                  </div>
                  <span className="text-[10px] text-slate-400">HCM 2010 Criteria</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <span className="italic">
                  * Instant preview running local discrete-time queue equations.
                </span>
                <button
                  onClick={() => onStartSimulation('traffic-college-gate')}
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  Open in Full Simulation Lab <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Process Explanation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            How WhatIf City Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            A Transparent 4-Step Simulation Journey
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Democratizing scenario modeling with accessible parameters, documented units, and explicit boundary
            trade-offs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="text-3xl mb-3">{step.icon}</div>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 block mb-1">
                STEP {step.step}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example Scenarios Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Curated Scenario Library
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Explore 5 Realistic Urban Challenges
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sample scenarios are clearly labeled as illustrative models using synthetic baseline data.
            </p>
          </div>
          <button
            onClick={onExploreScenarios}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1 group"
          >
            <span>View All Scenarios</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEFAULT_CLIENT_SCENARIOS.map((sc) => (
            <div
              key={sc.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/50 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                    {sc.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Synthetic Baseline
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {sc.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {sc.description}
                </p>

                {/* Key baseline parameters preview */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 text-[11px] space-y-1 font-mono text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Arrival Demand:</span>
                    <strong>{sc.inputParameters.arrivalRateVehiclesPerMin} veh/min</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Signal Cycle:</span>
                    <strong>{sc.inputParameters.signalCycleLengthSeconds}s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Baseline Green:</span>
                    <strong>{sc.inputParameters.effectiveGreenTimeSeconds}s</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-4">
                <button
                  onClick={() => onStartSimulation(sc.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate</span>
                </button>
                <button
                  onClick={onCompareScenarios}
                  className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                  title="Direct 3-way Plan Comparison"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
