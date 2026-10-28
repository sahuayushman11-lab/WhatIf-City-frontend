import React from 'react';

interface SchematicIntersectionProps {
  queueLength: number;
  isGreen: boolean;
  pedestrianCrossingActive: boolean;
  cycleLength: number;
  greenTime: number;
  currentTimeSecond?: number;
  scenarioName?: string;
}

export const SchematicIntersection: React.FC<SchematicIntersectionProps> = ({
  queueLength,
  isGreen,
  pedestrianCrossingActive,
  cycleLength,
  greenTime,
  currentTimeSecond = 14,
  scenarioName = 'Intersection Approach',
}) => {
  // Number of visual car icons to render (capped at 16 for schematic space)
  const displayCars = Math.min(16, queueLength);
  const remainingCount = queueLength > 16 ? queueLength - 16 : 0;

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl overflow-hidden select-none">
      {/* Top status bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping bg-teal-400"></span>
          <span className="font-semibold text-slate-100 tracking-wide">{scenarioName}</span>
          <span className="bg-slate-800 text-teal-400 px-2 py-0.5 rounded text-[11px] font-mono border border-teal-500/30">
            Schematic Model
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Signal:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider ${
                isGreen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isGreen ? 'GREEN' : 'RED'}
            </span>
          </div>
          <div className="text-slate-400 font-mono">
            Cycle: <span className="text-slate-200 font-bold">{currentTimeSecond % cycleLength}s</span> / {cycleLength}s
          </div>
        </div>
      </div>

      {/* SVG Canvas schematic */}
      <div className="relative w-full h-[280px] flex items-center justify-center my-2">
        <svg viewBox="0 0 500 320" className="w-full h-full max-h-[280px]">
          {/* Grass / Ground */}
          <rect x="0" y="0" width="500" height="320" fill="#0f172a" />

          {/* North-South Road */}
          <rect x="200" y="0" width="100" height="320" fill="#1e293b" />
          {/* East-West Road (Approaching Corridor) */}
          <rect x="0" y="110" width="500" height="100" fill="#1e293b" />

          {/* Road centerlines */}
          <line x1="0" y1="160" x2="190" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="310" y1="160" x2="500" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="250" y1="0" x2="250" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="250" y1="220" x2="250" y2="320" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 6" />

          {/* Zebra Crosswalk - West Approach */}
          <g>
            {[115, 125, 135, 145, 155, 165, 175, 185, 195].map((y, i) => (
              <rect key={i} x="180" y={y} width="12" height="5" fill="#f8fafc" opacity="0.9" rx="1" />
            ))}
          </g>

          {/* Zebra Crosswalk - East Approach */}
          <g>
            {[115, 125, 135, 145, 155, 165, 175, 185, 195].map((y, i) => (
              <rect key={i} x="308" y={y} width="12" height="5" fill="#f8fafc" opacity="0.9" rx="1" />
            ))}
          </g>

          {/* Stop Line (West approach) */}
          <rect x="175" y="110" width="4" height="100" fill="#ffffff" />

          {/* Traffic Signal Post at Intersection */}
          <g transform="translate(198, 92)">
            <rect x="0" y="0" width="16" height="38" rx="4" fill="#020617" stroke="#334155" strokeWidth="1" />
            {/* Red Light */}
            <circle
              cx="8"
              cy="8"
              r="4.5"
              fill={!isGreen ? '#ef4444' : '#450a0a'}
              stroke={!isGreen ? '#f87171' : 'none'}
              strokeWidth="1"
            />
            {/* Yellow Light */}
            <circle cx="8" cy="19" r="4.5" fill="#78350f" />
            {/* Green Light */}
            <circle
              cx="8"
              cy="30"
              r="4.5"
              fill={isGreen ? '#10b981' : '#064e3b'}
              stroke={isGreen ? '#34d399' : 'none'}
              strokeWidth="1"
            />
          </g>

          {/* Pedestrian Signal Post */}
          <g transform="translate(178, 85)">
            <circle
              cx="6"
              cy="6"
              r="6"
              fill={pedestrianCrossingActive ? '#10b981' : '#ef4444'}
              className={pedestrianCrossingActive ? 'animate-pulse' : ''}
            />
            <text x="6" y="9" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">
              {pedestrianCrossingActive ? '🚶' : '✋'}
            </text>
          </g>

          {/* Active Queued Vehicles in Approach Lane (West to East) */}
          <g>
            {Array.from({ length: displayCars }).map((_, idx) => {
              // Position cars in queue from stop line backwards towards the left
              const xPos = 160 - idx * 22;
              return (
                <g key={idx} transform={`translate(${xPos}, 170)`} className="transition-all duration-300">
                  {/* Car body */}
                  <rect
                    x="0"
                    y="0"
                    width="18"
                    height="12"
                    rx="3"
                    fill={idx === 0 ? '#38bdf8' : idx % 2 === 0 ? '#6366f1' : '#f59e0b'}
                    stroke="#ffffff"
                    strokeWidth="0.5"
                  />
                  {/* Windshield */}
                  <rect x="10" y="2" width="4" height="8" rx="1" fill="#0f172a" />
                  {/* Headlights */}
                  <circle cx="17" cy="2" r="1" fill="#fef08a" />
                  <circle cx="17" cy="10" r="1" fill="#fef08a" />
                </g>
              );
            })}
          </g>

          {/* Pedestrians crossing if active */}
          {pedestrianCrossingActive && (
            <g className="animate-pulse">
              <circle cx="186" cy="130" r="4" fill="#38bdf8" />
              <line x1="186" y1="134" x2="186" y2="148" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="186" cy="165" r="4" fill="#f43f5e" />
              <line x1="186" y1="169" x2="186" y2="183" stroke="#f43f5e" strokeWidth="2" />
            </g>
          )}

          {/* Direction indicator arrow */}
          <path d="M 60 176 L 100 176 M 92 172 L 100 176 L 92 180" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <text x="60" y="196" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
            Approach Flow
          </text>
        </svg>

        {/* Live Queue Floating Overlay badge */}
        <div className="absolute bottom-2 left-3 bg-slate-950/85 backdrop-blur border border-slate-700/60 rounded-xl px-3 py-1.5 shadow-lg flex items-center space-x-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Simulated Queue</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-extrabold font-mono text-teal-400">{queueLength}</span>
              <span className="text-xs text-slate-300">vehicles</span>
              {remainingCount > 0 && (
                <span className="text-[11px] text-amber-400 font-semibold">(+{remainingCount} off-screen)</span>
              )}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Discharge Flow</span>
            <span className={`text-xs font-semibold ${isGreen ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isGreen ? 'Discharging Active' : 'Stopped at Red'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom explanation line */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="flex items-center space-x-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Green Duration: {greenTime}s</span>
          <span className="text-slate-600">|</span>
          <span className="inline-block w-2 h-2 rounded-full bg-rose-400"></span>
          <span>Red Phase: {cycleLength - greenTime}s</span>
        </span>
        <span className="text-slate-500">Synthetic Visual Model (FIFO Queueing)</span>
      </div>
    </div>
  );
};
