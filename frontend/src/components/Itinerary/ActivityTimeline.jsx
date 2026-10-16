import React, { useState } from "react";
import { 
  IndianRupee, 
  Navigation, 
  RefreshCw, 
  ExternalLink, 
  Car, 
  ChevronDown, 
  ChevronUp, 
  Compass 
} from "lucide-react";
import { getDistanceFromLatLonInKm, estimateFareInr } from "../../utils/transitCalculator";
import StayCard from "./StayCard";
import FoodCard from "./FoodCard";

export default function ActivityTimeline({ 
  activities, 
  dayTheme, 
  onSwapActivity, 
  swappingIndex,
  stay,
  recommendedStays,
  food,
  recommendedFood
}) {
  const [expandedFareIndex, setExpandedFareIndex] = useState(null);

  if (!activities || activities.length === 0) return null;

  const toggleFare = (idx) => {
    setExpandedFareIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* ================= LEFT COLUMN: ACTIVITIES TIMELINE (8 COLS) ================= */}
      <div className="lg:col-span-7 xl:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              Day Itinerary
            </span>
            <h3 className="text-xl font-bold text-white mt-1">{dayTheme}</h3>
          </div>
        </div>

        <div className="space-y-4">
          {activities.map((act, idx) => {
            const isSwapping = swappingIndex === idx;
            const isFareOpen = expandedFareIndex === idx;

            // Estimate distance from previous activity or default to 3.5km
            let dist = 3.5;
            if (idx > 0 && activities[idx - 1].latitude && act.latitude) {
              dist = getDistanceFromLatLonInKm(
                activities[idx - 1].latitude,
                activities[idx - 1].longitude,
                act.latitude,
                act.longitude
              );
            }
            const fare = estimateFareInr(dist);

            // Google Maps deep link
            const mapsUrl = act.latitude && act.longitude
              ? `https://www.google.com/maps/search/?api=1&query=${act.latitude},${act.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.title)}`;

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition relative overflow-hidden"
              >
                {/* Activity Thumbnail */}
                {act.image_url && (
                  <img
                    src={act.image_url}
                    alt={act.title}
                    className="w-full sm:w-32 sm:h-32 rounded-xl object-cover shrink-0"
                  />
                )}

                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {act.time_of_day}
                      </span>
                      <span className="text-xs font-bold text-emerald-300 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {act.estimated_cost_inr}
                      </span>
                    </div>

                    {/* Actions: Maps, Fare Estimator & Swap */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Google Maps Button */}
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition"
                        title="Open in Google Maps"
                      >
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        <span>Maps</span>
                      </a>

                      {/* Fare Estimator Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleFare(idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition"
                        title="Estimate Auto & Cab Fares"
                      >
                        <Car className="w-3 h-3 text-emerald-400" />
                        <span>Transit Fare</span>
                        {isFareOpen ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                      </button>

                      {/* AI Spot Swapper Button */}
                      {onSwapActivity && (
                        <button
                          type="button"
                          disabled={isSwapping}
                          onClick={() => onSwapActivity(act, idx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-emerald-400 text-xs font-semibold transition disabled:opacity-50"
                          title="Replace this spot with another AI recommendation"
                        >
                          <RefreshCw className={`w-3 h-3 text-emerald-400 ${isSwapping ? "animate-spin" : ""}`} />
                          <span>{isSwapping ? "Swapping..." : "Swap"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white">{act.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{act.description}</p>

                  {act.transit_tip && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <Navigation className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{act.transit_tip}</span>
                    </div>
                  )}

                  {/* Collapsible Fare Estimator Panel */}
                  {isFareOpen && (
                    <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-emerald-500/20 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold border-b border-slate-800 pb-1.5">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Compass className="w-3 h-3" /> Leg Distance: ~{fare.distanceKm} km
                        </span>
                        <span>Estimated Transit (₹ INR)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">🛺 Local Auto-Rickshaw</span>
                          <span className="font-bold text-emerald-300 text-xs">{fare.auto}</span>
                        </div>
                        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">🚗 Uber / Ola Cab</span>
                          <span className="font-bold text-emerald-300 text-xs">{fare.cab}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: 3-4 STAYS & 3-4 FOOD CARDS (4-5 COLS) ================= */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-6">
        {/* Recommended Stays (3-4 options with tabs) */}
        <StayCard 
          stays={recommendedStays} 
          stay={stay} 
        />

        {/* Local Eateries (3-4 items list) */}
        <FoodCard 
          foods={recommendedFood} 
          food={food} 
        />
      </div>

    </div>
  );
}