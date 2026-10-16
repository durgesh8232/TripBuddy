import React from 'react';
import { Utensils } from 'lucide-react';

export default function FoodCard({ food, foods }) {
  // Normalize input: accepts either an array 'foods' or a single 'food' object
  const foodList = Array.isArray(foods) && foods.length > 0 
    ? foods 
    : (Array.isArray(food) ? food : (food ? [food] : []));

  if (foodList.length === 0) return null;

  return (
    <div className="bg-[#111927] border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <Utensils className="w-4 h-4" /> Local Eateries ({foodList.length} Options)
        </span>
        <span className="text-[11px] text-slate-400">Must-Try Food</span>
      </div>

      {/* 3-4 Stacked Eatery Cards */}
      <div className="space-y-2.5">
        {foodList.slice(0, 4).map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-900/70 border border-slate-800/80 rounded-xl hover:border-emerald-500/40 transition-all hover:bg-slate-800/40"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h5 className="text-sm font-semibold text-slate-100">{item.name}</h5>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span>{item.cuisine_type || item.dietary_type || 'Local Specialties'}</span>
                  {item.area && (
                    <>
                      <span>•</span>
                      <span>{item.area}</span>
                    </>
                  )}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                {item.approx_cost_for_two_inr || item.price_for_two || '₹250 for two'}
              </span>
            </div>

            {(item.must_try_dish || item.must_try) && (
              <div className="mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                <span className="text-emerald-300 font-medium">Must Try: </span>
                <span className="text-slate-300">{item.must_try_dish || item.must_try}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}