import React, { useState } from 'react';
import { Bed, ExternalLink, Sparkles, MapPin } from 'lucide-react';

const DEFAULT_HOTEL_IMG = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

export default function StayCard({ stay, stays }) {
  const stayList = Array.isArray(stays) && stays.length > 0
    ? stays
    : (Array.isArray(stay) ? stay : (stay ? [stay] : []));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeStay = stayList[selectedIndex] || stayList[0];

  if (!activeStay) return null;

  return (
    <div className="bg-[#111927] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
            <Bed className="w-4 h-4" /> Recommended Stays ({stayList.length} Options)
          </span>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${activeStay.name}${activeStay.area || ''}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
          >
            Directions <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {stayList.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950/60 rounded-xl">
            {stayList.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg truncate transition-all text-center ${
                  selectedIndex === idx
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
                title={item.name}
              >
                Option {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
        <img
          src={activeStay.image_url || DEFAULT_HOTEL_IMG}
          alt={activeStay.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_HOTEL_IMG;
          }}
        />
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-teal-500/40 text-teal-300 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {activeStay.price_per_night_inr || activeStay.price_per_night || '₹1,200 / night'}
        </div>
        <div className="absolute bottom-2 left-3 bg-slate-950/70 backdrop-blur-sm px-2.5 py-0.5 rounded text-[11px] text-slate-300">
          {activeStay.category || activeStay.best_for || 'Comfort Stay'}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-base font-bold text-white tracking-wide">{activeStay.name}</h4>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            {activeStay.area || 'Central Location'}
          </p>
        </div>

        {(activeStay.why_pick_here || activeStay.best_for) && (
          <div className="flex items-start gap-2 bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-teal-200">Why pick here:</strong>{' '}
              {activeStay.why_pick_here || activeStay.best_for}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}