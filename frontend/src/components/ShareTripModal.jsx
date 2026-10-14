import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, X } from "lucide-react";

export function formatTripForSharing(tripPlan, travelMonth) {
  if (!tripPlan) return "";

  const daysCount = tripPlan.itinerary?.length || 0;
  let text = `✈️ *TripBuddy Plan: ${tripPlan.destination}* (${daysCount} Days - ${travelMonth})\n`;
  text += `💰 *Est. Total Budget:* ${tripPlan.total_estimated_budget_inr}\n`;

  if (tripPlan.budget_breakdown_inr) {
    text += `📊 *Budget Breakdown:*\n`;
    Object.entries(tripPlan.budget_breakdown_inr).forEach(([k, v]) => {
      text += `  • ${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}\n`;
    });
  }

  text += `\n🗓️ *Day-by-Day Highlights:*\n`;
  tripPlan.itinerary?.forEach((day) => {
    text += `\n*Day ${day.day}: ${day.day_theme}*\n`;
    if (day.stay?.name) {
      text += `🏨 Stay: ${day.stay.name} (${day.stay.area}) - ${day.stay.price_per_night_inr}/night\n`;
    }
    day.activities?.forEach((act) => {
      text += `  • [${act.time_of_day}] ${act.title} (~${act.estimated_cost_inr})\n`;
    });
  });

  if (tripPlan.practical_travel_tips?.length > 0) {
    text += `\n💡 *Key Tips:*\n`;
    tripPlan.practical_travel_tips.slice(0, 3).forEach((tip) => {
      text += `  • ${tip}\n`;
    });
  }

  text += `\n🚀 Generated via *TripBuddy* (Built by Durgesh Sonar)`;
  return text;
}

export default function ShareTripModal({ isOpen, onClose, tripPlan, travelMonth }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !tripPlan) return null;

  const shareText = formatTripForSharing(tripPlan, travelMonth);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Failed to copy to clipboard.");
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <span>Share Trip Itinerary</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Share this trip directly with your travel companions on WhatsApp or copy the formatted text.
        </p>

        {/* Text Preview Box */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-900/20"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}