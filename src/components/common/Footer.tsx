import React from 'react';
import { ShieldAlert, Cpu, Heart } from 'lucide-react';

export const Footer: React.FC<{ setActiveTab: (tab: string) => void }> = ({ setActiveTab }) => {
  return (
    <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Prominent Educational Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <span className="font-bold tracking-wide uppercase text-[11px]">
              Academic &amp; Educational Simulation Disclaimer
            </span>
            <p className="leading-relaxed">
              WhatIf City is an interactive analytical tool designed for students, campus administration, and civic
              explorers. The underlying discrete-time queueing equations provide transparent, reproducible scenario
              comparisons. They <strong>do not</strong> substitute for professional microscopic traffic modeling
              (e.g., VISSIM, Synchro), statutory environmental impact statements, or accredited civil engineering
              certifications.
            </p>
          </div>
        </div>

        {/* Links and Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-500 dark:text-slate-400">
          <div className="space-y-2">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">WhatIf City</span>
            <p className="leading-relaxed">
              Enabling data-driven civic conversations by simulating urban interventions before public capital is
              committed.
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block mb-2">
              Platform Features
            </span>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActiveTab('explore')} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Scenario Library (5 Interventions)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('simulation')} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Simulation Lab &amp; Visualizer
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('compare')} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Multi-Plan Trade-Off Comparison
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('projects')} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Saved Scenario Projects
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block mb-2">
              Transparency
            </span>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Mathematical Formulas &amp; Queue Units
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('methodology')} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                  Highway Capacity Manual (HCM) LOS
                </button>
              </li>
              <li>
                <span className="text-slate-400">Deterministic Seeded Reproducibility</span>
              </li>
              <li>
                <span className="text-slate-400">Zero Paid API Lock-In Guarantee</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] block mb-2">
              Engineering Architecture
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['React 18', 'Vite', 'TypeScript', 'Tailwind', 'Recharts', 'Leaflet', 'Express', 'Zod', 'Supabase'].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} WhatIf City &bull; Open Urban Scenario Platform</span>
          <span className="flex items-center gap-1">
            Built for civic innovation &bull; Transparent simulation algorithms
          </span>
        </div>
      </div>
    </footer>
  );
};
