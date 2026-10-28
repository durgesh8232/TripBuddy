import React from "react";
import ActivityTimeline from "./ActivityTimeline";
import StayCard from "./StayCard";
import FoodCard from "./FoodCard";

export default function DayTabs({
  days = [],
  activeDay = 1,
  setActiveDay,
  onSwapActivity,
  swappingIndex,
}) {
  if (!days || days.length === 0) return null;

  // Find the selected day, fallback to first day
  const currentDay = days.find((d) => d.day === activeDay) || days[0];

  return (
    <div className="space-y-6">
      {/* 1. Day Navigation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {days.map((d) => (
          <button
            key={d.day}
            type="button"
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

      {/* 2. Side-by-Side 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Activities Timeline */}
        <div className="lg:col-span-7 xl:col-span-7">
          <ActivityTimeline
            activities={currentDay.activities}
            dayTheme={currentDay.day_theme}
            onSwapActivity={onSwapActivity}
            swappingIndex={swappingIndex}
          />
        </div>

        {/* Right Column (5 cols): 3-4 Recommended Stays & 3-4 Local Eateries */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          <StayCard
            stays={currentDay.recommended_stays}
            stay={currentDay.stay}
          />
          <FoodCard
            foods={currentDay.recommended_food || currentDay.local_eateries}
            food={currentDay.food}
          />
        </div>
      </div>
    </div>
  );
}