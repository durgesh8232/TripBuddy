import React from "react";
import { BedDouble, MapPin, IndianRupee, Sparkles, ExternalLink } from "lucide-react";

export default function StayCard({ stay }) {
  if (!stay) return null;

  const hotelMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${stay.name}${stay.area}`
  )}`;

  return (
    <div className="overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl shadow-xl space-y-4">
      {/* Hotel Image */}
      {stay.image_url && (
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={stay.image_url}
            alt={stay.name}
            className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />
            {stay.price_per_night_inr} / night
          </div>
        </div>
      )}

      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-bold">
            <BedDouble className="w-4 h-4" /> Recommended Stay
          </div>

          <a
            href={hotelMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">{stay.name}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {stay.area}
          </p>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong className="text-white">Why pick here:</strong> {stay.best_for}</span>
        </div>
      </div>
    </div>
  );
}