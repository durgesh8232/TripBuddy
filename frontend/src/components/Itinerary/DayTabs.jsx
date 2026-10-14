import React from "react";

export default function DayTabs({ days, activeDay, setActiveDay }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {days.map((d) => (
        <button
          key={d.day}
          onClick={() => setActiveDay(d.day)}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition shrink-0 ${
            activeDay === d.day
              ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          Day {d.day}
        </button>
      ))}
    </div>
  );
}