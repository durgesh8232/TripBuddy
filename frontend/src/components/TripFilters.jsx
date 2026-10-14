import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Compass, 
  Utensils, 
  Users, 
  Car,
  Loader2,
  ChevronRight
} from "lucide-react";

// Catalog of searchable Indian destinations with states/categories
const DESTINATIONS_DATABASE = [
  { name: "Nashik", state: "Maharashtra", tag: "Wine & Temples" },
  { name: "Goa", state: "Goa", tag: "Beaches & Nightlife" },
  { name: "Manali", state: "Himachal Pradesh", tag: "Snow & Mountains" },
  { name: "Jaipur", state: "Rajasthan", tag: "Royal Palaces" },
  { name: "Kerala (Munnar / Alleppey)", state: "Kerala", tag: "Backwaters & Hills" },
  { name: "Udaipur", state: "Rajasthan", tag: "Lakes & Heritage" },
  { name: "Varanasi", state: "Uttar Pradesh", tag: "Spiritual Ghats" },
  { name: "Ujjain", state: "Madhya Pradesh", tag: "Mahakal Temple & Heritage" },
  { name: "Pune", state: "Maharashtra", tag: "Forts & Culture" },
  { name: "Mumbai", state: "Maharashtra", tag: "Coastline & City Lights" },
  { name: "Mahabaleshwar", state: "Maharashtra", tag: "Hills & Strawberries" },
  { name: "Lonavala", state: "Maharashtra", tag: "Waterfalls & Valleys" },
  { name: "Shirdi", state: "Maharashtra", tag: "Spiritual Pilgrimage" },
  { name: "Amritsar", state: "Punjab", tag: "Golden Temple & Cuisine" },
  { name: "Rishikesh", state: "Uttarakhand", tag: "River Rafting & Yoga" },
  { name: "Agra", state: "Uttar Pradesh", tag: "Taj Mahal & Monuments" },
  { name: "Darjeeling", state: "West Bengal", tag: "Tea Gardens & Himalayas" },
  { name: "Ooty", state: "Tamil Nadu", tag: "Blue Mountains" },
  { name: "Coorg", state: "Karnataka", tag: "Coffee Plantations" },
  { name: "Hampi", state: "Karnataka", tag: "Ancient Ruins & Boulders" },
  { name: "Pondicherry", state: "Tamil Nadu", tag: "French Quarters & Beach" },
  { name: "Leh Ladakh", state: "Ladakh", tag: "High Altitude Passes & Monasteries" },
  { name: "Srinagar", state: "Jammu & Kashmir", tag: "Dal Lake & Shikaras" },
  { name: "Jaisalmer", state: "Rajasthan", tag: "Golden Fort & Desert Safari" },
  { name: "Rann of Kutch", state: "Gujarat", tag: "White Desert & Culture" }
];

export default function TripFilters({
  destination,
  setDestination,
  travelMonth,
  setTravelMonth,
  durationDays,
  setDurationDays,
  budgetTier,
  setBudgetTier,
  vibe,
  setVibe,
  dietary,
  setDietary,
  pacing,
  setPacing,
  travelGroup,
  setTravelGroup,
  transportPref,
  setTransportPref,
  onPlanTrip,
  loading,
}) {
  const quickDestinations = ["Goa", "Manali", "Jaipur", "Kerala", "Udaipur", "Varanasi", "Nashik", "Ujjain"];
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const wrapperRef = useRef(null);

  // Filter destinations based on user input
  useEffect(() => {
    const query = destination.trim().toLowerCase();
    if (!query) {
      setFilteredOptions(DESTINATIONS_DATABASE.slice(0, 6));
    } else {
      const matches = DESTINATIONS_DATABASE.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.state.toLowerCase().includes(query) ||
          item.tag.toLowerCase().includes(query)
      );
      setFilteredOptions(matches.slice(0, 6));
    }
  }, [destination]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDestination = (cityName) => {
    setDestination(cityName);
    setDropdownOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl dark:shadow-2xl backdrop-blur-sm transition-colors duration-200">
      
      {/* Primary Row: Destination Input with Live Autocomplete */}
      <div className="space-y-2" ref={wrapperRef}>
        <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <MapPin className="w-4 h-4" /> Destination
        </label>
        
        <div className="relative">
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
            placeholder="Type a city, state, or attraction (e.g. Nashik, Ujjain, Goa)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 pl-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition shadow-inner"
          />
          <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

          {/* Autocomplete Suggestions Menu */}
          {dropdownOpen && filteredOptions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-30 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold uppercase text-slate-400">
                Matching Destinations
              </div>
              {filteredOptions.map((item) => (
                <div
                  key={item.name}
                  onClick={() => handleSelectDestination(item.name)}
                  className="px-4 py-2.5 flex items-center justify-between hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 block">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.state} • {item.tag}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-transform group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Popular:</span>
          {quickDestinations.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleSelectDestination(city)}
              className={`text-xs px-2.5 py-1 rounded-full border transition ${
                destination.toLowerCase() === city.toLowerCase()
                  ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-semibold"
                  : "bg-slate-100 dark:bg-slate-950/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Core Trip Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800/80">
        {/* Month */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Travel Month
          </label>
          <select
            value={travelMonth}
            onChange={(e) => setTravelMonth(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            {[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Duration
          </label>
          <select
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            {[1, 2, 3, 4, 5, 7, 10].map((d) => (
              <option key={d} value={d}>{d} {d === 1 ? "Day" : "Days"}</option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Budget Tier (₹ INR)
          </label>
          <select
            value={budgetTier}
            onChange={(e) => setBudgetTier(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Backpacker (Hostels & Local Cafes)">Backpacker (Hostels & Local Cafes)</option>
            <option value="Moderate (3-Star + Good Cafes)">Moderate (3-Star + Good Cafes)</option>
            <option value="Luxury (Resorts & Fine Dine)">Luxury (Resorts & Fine Dine)</option>
          </select>
        </div>

        {/* Vibe */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Travel Vibe
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Food & Nightlife">Food & Nightlife</option>
            <option value="Heritage & Temples">Heritage & Temples</option>
            <option value="Nature, Treks & Waterfalls">Nature, Treks & Waterfalls</option>
            <option value="Beach & Relaxation">Beach & Relaxation</option>
          </select>
        </div>
      </div>

      {/* Row 2: Advanced Customization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        {/* Pacing */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Trip Pacing</label>
          <select
            value={pacing}
            onChange={(e) => setPacing(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Relaxed">Relaxed (2–3 spots/day, leisure)</option>
            <option value="Balanced">Balanced (3–4 spots/day, standard)</option>
            <option value="Fast-Paced">Fast-Paced (4–5 spots/day, packed)</option>
          </select>
        </div>

        {/* Group Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Group Type
          </label>
          <select
            value={travelGroup}
            onChange={(e) => setTravelGroup(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Solo">Solo Traveler</option>
            <option value="Couple">Couple</option>
            <option value="Friends">Friends Group</option>
            <option value="Family">Family Trip</option>
          </select>
        </div>

        {/* Transport Preference */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Transport Preference
          </label>
          <select
            value={transportPref}
            onChange={(e) => setTransportPref(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Public & Auto">Public & Auto</option>
            <option value="Self-Drive Rental">Self-Drive Rental</option>
            <option value="Private Cab">Private Cab</option>
          </select>
        </div>

        {/* Dietary Preference */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> Dietary
          </label>
          <select
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="Any">Any / Local Authentic</option>
            <option value="Pure Vegetarian">Pure Vegetarian</option>
            <option value="Jain (No Root Veg)">Jain (No Onion / Garlic)</option>
            <option value="Non-Vegetarian">Non-Vegetarian Focused</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={onPlanTrip}
        disabled={loading || !destination.trim()}
        className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating & Saving Itinerary...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate & Save Itinerary</span>
          </>
        )}
      </button>
    </div>
  );
}