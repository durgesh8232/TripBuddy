import React, { useState, useEffect } from "react";
import { IndianRupee, Sliders, RotateCcw, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

// Helper to sanitize numeric values from strings like "₹12,500" or "12500"
function parseRupee(val) {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

export default function BudgetTweaker({ initialBreakdown, totalBudgetRaw, durationDays }) {
  // Parse original AI baseline values
  const defaultTotal = parseRupee(totalBudgetRaw) || 15000;
  
  const parseCategory = (key, fallbackPercent) => {
    if (initialBreakdown && initialBreakdown[key]) {
      return parseRupee(initialBreakdown[key]);
    }
    return Math.round(defaultTotal * fallbackPercent);
  };

  const getBaseline = () => ({
    stays: parseCategory("stays", 0.40),
    food: parseCategory("food", 0.25),
    travel: parseCategory("travel", 0.20),
    activities: parseCategory("activities", 0.15),
  });

  const [allocations, setAllocations] = useState(getBaseline);

  // Sync state if a newly generated plan arrives
  useEffect(() => {
    setAllocations(getBaseline());
  }, [initialBreakdown, totalBudgetRaw]);

  const currentTotalAllocated = 
    allocations.stays + allocations.food + allocations.travel + allocations.activities;
  
  const remainingBudget = defaultTotal - currentTotalAllocated;
  const isOverBudget = remainingBudget < 0;
  const perDayCost = Math.round(currentTotalAllocated / Math.max(1, durationDays || 1));

  const handleSliderChange = (category, value) => {
    setAllocations((prev) => ({
      ...prev,
      [category]: Number(value),
    }));
  };

  const handleReset = () => {
    setAllocations(getBaseline());
  };

  const categories = [
    { key: "stays", label: "Hotels & Stays", color: "accent-emerald-400", bg: "bg-emerald-500/10 text-emerald-400" },
    { key: "food", label: "Dining & Food", color: "accent-amber-400", bg: "bg-amber-500/10 text-amber-400" },
    { key: "travel", label: "Transit & Autos", color: "accent-sky-400", bg: "bg-sky-500/10 text-sky-400" },
    { key: "activities", label: "Sightseeing & Entry", color: "accent-purple-400", bg: "bg-purple-500/10 text-purple-400" },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
      {/* Header and Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Interactive Expense Tweaker
          </span>
          <h3 className="text-lg font-bold text-white mt-1">Customize Budget Allocation</h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Real-time Balance and Per-day Metric */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Allocated Spend</span>
          <span className="text-lg font-extrabold text-white flex items-center gap-0.5 mt-0.5">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            {currentTotalAllocated.toLocaleString("en-IN")}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border ${
          isOverBudget 
            ? "bg-rose-500/10 border-rose-500/30 text-rose-300" 
            : "bg-slate-950/80 border-slate-800 text-slate-300"
        }`}>
          <span className="text-[11px] text-slate-400 font-medium block">
            {isOverBudget ? "Over Budget Deficit" : "Remaining Buffer"}
          </span>
          <span className={`text-lg font-extrabold flex items-center gap-0.5 mt-0.5 ${
            isOverBudget ? "text-rose-400" : "text-emerald-400"
          }`}>
            <IndianRupee className="w-4 h-4" />
            {Math.abs(remainingBudget).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium block">Approx Per Day Spend</span>
          <span className="text-lg font-extrabold text-white flex items-center gap-0.5 mt-0.5">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            {perDayCost.toLocaleString("en-IN")} / day
          </span>
        </div>
      </div>

      {/* Allocation Sliders */}
      <div className="space-y-4 pt-2">
        {categories.map(({ key, label, color, bg }) => {
          const val = allocations[key];
          const percentage = Math.round((val / (currentTotalAllocated || 1)) * 100);

          return (
            <div key={key} className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bg}`}>
                    {percentage}%
                  </span>
                  <span className="font-bold text-white flex items-center">
                    <IndianRupee className="w-3 h-3 text-emerald-400" />
                    {val.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max={Math.max(defaultTotal * 1.2, 50000)}
                step="250"
                value={val}
                onChange={(e) => handleSliderChange(key, e.target.value)}
                className={`w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer ${color}`}
              />
            </div>
          );
        })}
      </div>

      {/* Status Warning or Validation */}
      {isOverBudget ? (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>You have exceeded your total estimated budget by ₹{Math.abs(remainingBudget).toLocaleString("en-IN")}. Adjust your sliders or consider increasing your tier.</span>
        </div>
      ) : (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>All allocations are balanced within your target budget tier!</span>
        </div>
      )}
    </div>
  );
}