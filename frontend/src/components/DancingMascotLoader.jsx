import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const LOADING_STEPS = [
  "Packing bags & adjusting sunglasses...",
  "Scouting authentic local food joints...",
  "Comparing auto vs. cab route fares...",
  "Polishing day-by-day sightseeing spots...",
  "Almost ready! Putting it all together...",
];

export default function DancingMascotLoader({ loading, destination }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div className="flex flex-col items-center justify-center p-8 max-w-sm w-full mx-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5">
        
        {/* Cartoon Character Wrapper */}
        <div className="relative flex flex-col items-center justify-center h-44 w-44">
          <svg
            viewBox="0 0 140 160"
            className="w-36 h-36 animate-mascot-dance overflow-visible"
          >
            {/* Cute Backpack */}
            <rect
              x="24"
              y="60"
              width="22"
              height="38"
              rx="7"
              fill="#059669"
              className="drop-shadow-md"
            />
            <rect
              x="26"
              y="66"
              width="6"
              height="26"
              rx="3"
              fill="#10b981"
            />

            {/* Left Arm (Dancing) */}
            <g className="animate-arm-left">
              <path
                d="M 38 75 Q 16 68 22 50"
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="22" cy="48" r="6" fill="#34d399" />
            </g>

            {/* Right Arm (Dancing) */}
            <g className="animate-arm-right">
              <path
                d="M 102 75 Q 124 68 118 50"
                stroke="#10b981"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="118" cy="48" r="6" fill="#34d399" />
            </g>

            {/* Main Rounded Body (Cute Jelly / Suitcase hybrid) */}
            <rect
              x="36"
              y="45"
              width="68"
              height="72"
              rx="28"
              fill="#10b981"
              className="drop-shadow-lg"
            />

            {/* Belly highlight */}
            <ellipse
              cx="70"
              cy="88"
              rx="20"
              ry="18"
              fill="#34d399"
              opacity="0.5"
            />

            {/* Cool Sunglasses */}
            <rect
              x="44"
              y="60"
              width="22"
              height="14"
              rx="4"
              fill="#0f172a"
            />
            <rect
              x="74"
              y="60"
              width="22"
              height="14"
              rx="4"
              fill="#0f172a"
            />
            <line
              x1="66"
              y1="66"
              x2="74"
              y2="66"
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Sunglasses Lens Glare */}
            <line
              x1="48"
              y1="64"
              x2="54"
              y2="70"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="78"
              y1="64"
              x2="84"
              y2="70"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Big Cheerful Smile */}
            <path
              d="M 60 84 Q 70 94 80 84"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Rosy Cheeks */}
            <circle cx="48" cy="78" r="4.5" fill="#f43f5e" opacity="0.6" />
            <circle cx="92" cy="78" r="4.5" fill="#f43f5e" opacity="0.6" />

            {/* Left Foot */}
            <ellipse
              cx="54"
              cy="124"
              rx="10"
              ry="6"
              fill="#047857"
            />

            {/* Right Foot */}
            <ellipse
              cx="86"
              cy="124"
              rx="10"
              ry="6"
              fill="#047857"
            />
          </svg>

          {/* Dynamic Ground Shadow */}
          <div className="w-24 h-3 bg-slate-900/40 dark:bg-slate-400/20 rounded-full blur-[2px] animate-shadow-scale mt-1" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TripBuddy is cooking up your trip!</span>
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Planning {destination ? destination : "your getaway"}...
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 min-h-[1.5rem] transition-all duration-300">
            {LOADING_STEPS[stepIndex]}
          </p>
        </div>

        {/* Progress pulse dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse delay-75" />
          <span className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
}