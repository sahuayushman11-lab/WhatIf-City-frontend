import React from 'react';
import { BookOpen, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Scale, Calculator } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Transparent Open Science
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Simulation Methodology &amp; Mathematical Formulation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Full documentation of the discrete-time queueing model, formulas, boundary invariants, units, and academic
          limitations implemented in WhatIf City.
        </p>
      </div>

      {/* Prominent Educational Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <span className="font-bold text-xs uppercase tracking-wide">Essential Academic Disclaimer</span>
          <p className="leading-relaxed">
            WhatIf City is an educational simulation sandbox intended for students, campus planners, and civic
            explorers to test ideas before building. These macroscopic deterministic equations <strong>do not</strong>{' '}
            substitute for accredited civil engineering software (such as VISSIM, Synchro, or AIMSUN), microscopic
            car-following models, or statutory environmental impact reviews.
          </p>
        </div>
      </div>

      {/* 1. Core Traffic Intersection Model */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            1. Core Traffic Intersection Model (Discrete-Time Queue)
          </h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          The core model executes a deterministic or seeded pseudo-random discrete-time queueing simulation evaluated at
          uniform time steps of &Delta;t = 1 second over the configured simulation horizon <em>T</em>.
        </p>

        {/* Math equations box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 font-mono text-xs">
          <div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold block mb-1">
              A. Signal Cycle Phasing
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              Offset: &tau;(t) = t mod C
              <br />
              IsGreen(t) = 1 &nbsp; if 0 &le; &tau;(t) &lt; g, &nbsp; else 0
              <br />
              Red Time: r = C &minus; g &minus; y &nbsp; (where y is clearance interval &ge; 4s)
            </p>
          </div>

          <div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold block mb-1">
              B. Arriving Vehicles A(t)
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              Deterministic: &mu;<sub>A</sub> = (&lambda; / 60) &bull; &Delta;t, accumulated fractional buffer
              <br />
              Stochastic: A(t) ~ Poisson(&mu;<sub>A</sub>) with fixed integer seed &sigma;
            </p>
          </div>

          <div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold block mb-1">
              C. Discharge Capacity &amp; Departures D(t)
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              Cap(t) = (s / 60) &bull; &Delta;t &nbsp; if IsGreen(t) = 1, else 0
              <br />
              D(t) = min(Q(t&minus;1) + A(t), &lfloor;Cap<sub>accum</sub>&rfloor;)
            </p>
          </div>

          <div>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold block mb-1">
              D. Non-Negative Queue Invariant
            </span>
            <p className="text-slate-700 dark:text-slate-300">
              Q(t) = max(0, Q(t&minus;1) + A(t) &minus; D(t))
              <br />
              &Delta;Delay(t) = Q(t) &bull; &Delta;t &nbsp; [veh-sec]
              <br />
              Total Delay = &sum; Q(t) &bull; &Delta;t
            </p>
          </div>
        </div>
      </section>

      {/* 2. Level of Service Criteria */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          2. Highway Capacity Manual (HCM 2010) Level of Service (LOS)
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Control delay per vehicle dictates the standardized Highway Capacity Manual Level of Service grading:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-2.5 px-3">LOS Grade</th>
                <th className="py-2.5 px-3">Control Delay Threshold</th>
                <th className="py-2.5 px-3">Operational Flow Characterization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-600">LOS A</td>
                <td className="py-2.5 px-3">&le; 10.0 seconds / veh</td>
                <td className="py-2.5 px-3 font-sans">Free flow; negligible queue formation.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-emerald-500">LOS B</td>
                <td className="py-2.5 px-3">10.1 &ndash; 20.0 seconds / veh</td>
                <td className="py-2.5 px-3 font-sans">Stable progression; minor platooning.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-500">LOS C</td>
                <td className="py-2.5 px-3">20.1 &ndash; 35.0 seconds / veh</td>
                <td className="py-2.5 px-3 font-sans">Noticeable queues; complete green clearance.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-600">LOS D</td>
                <td className="py-2.5 px-3">35.1 &ndash; 55.0 seconds / veh</td>
                <td className="py-2.5 px-3 font-sans">Approaching unstable capacity; noticeable delays.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-500">LOS E</td>
                <td className="py-2.5 px-3">55.1 &ndash; 80.0 seconds / veh</td>
                <td className="py-2.5 px-3 font-sans">At physical capacity; poor cycle progression.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-600">LOS F</td>
                <td className="py-2.5 px-3">&gt; 80.0 seconds / veh or v/c &gt; 1.0</td>
                <td className="py-2.5 px-3 font-sans">Oversaturated; continuous residual queue growth.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Safe Percentage Change & Multi-Objective Formulas */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          3. Comparative Math &amp; Zero-Denominator Handling
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <p>
            When calculating percentage difference between proposed plan <em>P</em> and baseline <em>B</em>:
          </p>
          <div className="font-mono bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-teal-700 dark:text-teal-300">
            &Delta;% = ((P &minus; B) / B) &times; 100% &nbsp; if B &ne; 0, else &quot;N/A&quot;
          </div>
          <p className="text-[11px] text-slate-500">
            This prevents NaN or Infinity when baseline metric is zero (e.g., zero initial queue or zero unserved cars).
          </p>
        </div>
      </section>

      {/* 4. Multi-Objective Weighting Disclosure */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            4. Disclosed Multi-Objective Weights
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          No aggregate score hides safety constraints. The four evaluation profiles disclose exact mathematical
          weights:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">Balanced Campus:</span>
            <p className="font-mono text-teal-600 dark:text-teal-400">
              Score = 100 &minus; (0.40 &bull; Delay + 0.30 &bull; Queue + 0.30 &bull; PedWait)
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">Minimize Vehicular Delay:</span>
            <p className="font-mono text-teal-600 dark:text-teal-400">
              Score = 100 &minus; (0.70 &bull; Delay + 0.20 &bull; Queue + 0.10 &bull; PedWait)
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">Minimize Queue Spillback:</span>
            <p className="font-mono text-teal-600 dark:text-teal-400">
              Score = 100 &minus; (0.70 &bull; Queue + 0.20 &bull; Delay + 0.10 &bull; PedWait)
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">Prioritize Pedestrian Access:</span>
            <p className="font-mono text-teal-600 dark:text-teal-400">
              Score = 100 &minus; (0.60 &bull; PedWait + 0.20 &bull; Delay + 0.20 &bull; Queue)
            </p>
          </div>
        </div>
      </section>

      {/* 5. Additional Modular Scenario Formulas */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          5. Additional Modular Urban Models
        </h2>
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Parking Demand &amp; Cruising Delays:</h4>
            <p>
              Uses Little&rsquo;s Law steady-state accumulation <em>L<sub>p</sub> = &lambda;<sub>p</sub> &bull; T<sub>d</sub></em>.
              When occupancy &rho; exceeds 85%, cruising search delay increases non-linearly:
              <br />
              <code className="font-mono text-teal-600 dark:text-teal-400">
                T<sub>search</sub> = 1.5 + 12.0 &bull; ((&rho; &minus; 0.85) / 0.15)<sup>2</sup> [minutes]
              </code>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Campus Shuttle Headway &amp; Capacity:</h4>
            <p>
              Headway between buses: <em>H = T<sub>loop</sub> / FleetSize</em>. Hourly passenger carrying capacity:
              <br />
              <code className="font-mono text-teal-600 dark:text-teal-400">
                Cap = (60 / H) &bull; CapacityPerBus [pax/hour]
              </code>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
