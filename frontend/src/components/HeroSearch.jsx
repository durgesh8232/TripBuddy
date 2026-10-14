import React from "react";
import { Compass, Sparkles } from "lucide-react";

export default function HeroSearch({ destination, setDestination, userName }) {
  const quickPicks = ["Goa", "Manali", "Jaipur", "Kerala", "Udaipur", "Varanasi", "Nashik"];

  return (
    <div className="text-center space-y-4 pt-4 pb-2">
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
        Where do you want to travel,{" "}
        <span className="text-emerald-500 underline decoration-emerald-500/30">
          {userName || "Traveler"}
        </span>
        ?
      </h1>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
        AI-optimized day-by-day travel plans, stays, and authentic food with prices strictly in ₹ INR.
      </p>

      {/* Quick Pick Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {quickPicks.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setDestination(city)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
              destination.toLowerCase() === city.toLowerCase()
                ? "bg-emerald-500 text-slate-950 border-emerald-500 font-bold"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
            }`}
          >
            📍 {city}
          </button>
        ))}
      </div>
    </div>
  );
}