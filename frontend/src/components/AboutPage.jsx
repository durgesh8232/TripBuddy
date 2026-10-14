import React from "react";
import { 
  Compass, 
  GraduationCap, 
  MapPin, 
  AlertCircle, 
  Zap, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  ArrowLeft,
  Briefcase,
  Layers,
  Code2
} from "lucide-react";

export default function AboutPage({ onBack }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Trip Planner
      </button>

      {/* Hero Header */}
      <section className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Case Study & Engineering Portfolio
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          Solving the Chaos of Indian Travel Planning
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          How TripBuddy transforms hours of fragmented tabs, unpredictable budgeting, and zigzag routing into an automated, rupee-denominated itinerary in seconds.
        </p>
      </section>

      {/* Case Study Section: The Problem */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
          <AlertCircle className="w-5 h-5" />
          <h2>The Problem: What Travelers Face Today</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white">1. Currency Disconnect</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard global AI tools output pricing in USD ($), leaving domestic Indian travelers confused about real auto-rickshaw fares, thali rates, and local taxes.
            </p>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white">2. Route Backtracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generic blog itineraries recommend spots on opposite ends of a city in the same afternoon, wasting 3+ hours in traffic and burning extra taxi fare.
            </p>
          </div>

          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white">3. Fragmented Planning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Travelers juggle weather forecasts, maps pins, notes apps, and booking sites with zero seamless offline export or consolidated view.
            </p>
          </div>
        </div>
      </section>

      {/* The TripBuddy Solution */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
          <Zap className="w-5 h-5" />
          <h2>The TripBuddy Architecture & Solution</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Strict ₹ INR Budgeting</h4>
            <p className="text-[11px] text-slate-400">
              Categorized breakdowns for stays, meals, local transit, and spot tickets customized to backpacker, moderate, or luxury tiers.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Geographic Sequencing</h4>
            <p className="text-[11px] text-slate-400">
              Activities are sequenced chronologically (morning, afternoon, evening) with coordinate pins on interactive Leaflet maps.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Live Weather Sync</h4>
            <p className="text-[11px] text-slate-400">
              Real-time weather tracking powered by Open-Meteo ensures users pack properly for current conditions.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">MySQL Persistence</h4>
            <p className="text-[11px] text-slate-400">
              Saves every itinerary in a relational database for instant history retrieval and clean PDF downloads.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Profile Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
         {/* Profile Photo */}
<div className="relative shrink-0">
  <div className="w-40 sm:w-48 h-52 sm:h-60 rounded-2xl overflow-hidden border-2 border-emerald-400/80 shadow-2xl shadow-emerald-500/20 bg-slate-950">
    <img
      src="/durgesh.jpg"
      alt="Durgesh Gorakh Sonar"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "50% 35%", // Centers your face and suit perfectly
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.style.display = "none";
        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
      }}
    />
    <div 
      style={{ display: "none" }} 
      className="w-full h-full items-center justify-center font-black text-3xl text-emerald-400 bg-slate-900"
    >
      DS
    </div>
  </div>
  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-xl shadow-lg border border-emerald-400">
    <Code2 className="w-4 h-4" />
  </div>
</div>

          {/* Bio & Details */}
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" /> MCA Student & Full-Stack Developer
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Durgesh Gorakh Sonar
              </h2>
              <p className="text-xs text-emerald-400/90 font-medium flex items-center justify-center sm:justify-start gap-1 mt-1">
                <Briefcase className="w-3.5 h-3.5" /> Full-Stack Web Development & AI Engineering
              </p>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Engineered TripBuddy as a comprehensive full-stack platform addressing real-world travel planning friction. The project unifies LLM reasoning with relational schema design (MySQL), real-time weather integrations (Open-Meteo), geographic routing (Leaflet.js), and client-side vector document generation (jsPDF).
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-300">FastAPI (Python)</span>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-300">React & Vite</span>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-300">Tailwind CSS</span>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-300">MySQL & SQLAlchemy</span>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-300">Open-Meteo Forecasts</span>
              <span className="px-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-xl text-[11px] font-semibold text-slate-300">OpenRouter AI</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}