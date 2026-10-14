import React from "react";
import { Utensils } from "lucide-react";

export default function FoodCard({ foods }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
        <Utensils className="w-4 h-4" /> Local Eateries
      </div>
      <div className="space-y-2">
        {foods.map((food, i) => (
          <div key={i} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white text-xs">{food.name}</span>
              <span className="text-xs text-emerald-400">{food.approx_cost_for_two_inr}</span>
            </div>
            <span className="text-xs text-slate-400 block">{food.cuisine_type}</span>
            <span className="text-xs text-amber-300 font-medium block">Must Try: {food.must_try_dish}</span>
          </div>
        ))}
      </div>
    </div>
  );
}