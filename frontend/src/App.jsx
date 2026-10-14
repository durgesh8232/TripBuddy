import React, { useState } from "react";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import HeroSearch from "./components/HeroSearch";
import TripFilters from "./components/TripFilters";
import WeatherWidget from "./components/WeatherWidget";
import BudgetTweaker from "./components/BudgetTweaker";
import ShareTripModal from "./components/ShareTripModal";
import ReviewSection from "./components/ReviewSection";
import DancingMascotLoader from "./components/DancingMascotLoader";
import WalkingBuddy from "./components/WalkingBuddy";
import LocalPhrasesCard from "./components/LocalPhrasesCard";
import DayTabs from "./components/Itinerary/DayTabs";
import ActivityTimeline from "./components/Itinerary/ActivityTimeline";
import StayCard from "./components/Itinerary/StayCard";
import FoodCard from "./components/Itinerary/FoodCard";
import MapView from "./components/MapView";
import PackingChecklist from "./components/PackingChecklist";
import ChatAssistant from "./components/ChatAssistant";
import SavedTripsDrawer from "./components/SavedTripsDrawer";
import AboutPage from "./components/AboutPage";
import Footer from "./components/Footer";
import { planTrip, swapActivity } from "./services/api";
import { generateTripPdf } from "./utils/exportPdf";
import { formatCurrency, EXCHANGE_RATES } from "./utils/currency";
import { ShieldCheck, CheckCircle2, Download, Loader2, Share2, Coins } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("planner"); // "planner" | "about"

  // Filter & Trip Input States
  const [destination, setDestination] = useState("Nashik");
  const [travelMonth, setTravelMonth] = useState("December");
  const [durationDays, setDurationDays] = useState(3);
  const [budgetTier, setBudgetTier] = useState("Moderate (3-Star + Good Cafes)");
  const [vibe, setVibe] = useState("Heritage & Temples");
  const [dietary, setDietary] = useState("Pure Vegetarian");
  const [pacing, setPacing] = useState("Balanced");
  const [travelGroup, setTravelGroup] = useState("Solo");
  const [transportPref, setTransportPref] = useState("Public & Auto");

  // Output, Currency & UI States
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [tripPlan, setTripPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [swappingIndex, setSwappingIndex] = useState(null);
  const [pdfExporting, setPdfExporting] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const handleGenerate = async () => {
    if (!destination.trim()) return;
    setLoading(true);
    setError("");
    setSaveSuccessNotice(false);

    try {
      const res = await planTrip({
        user_id: user?.id,
        destination,
        travel_month: travelMonth,
        duration_days: durationDays,
        budget_tier: budgetTier,
        vibe,
        dietary_preference: dietary,
        pacing,
        travel_group: travelGroup,
        transport_pref: transportPref,
      });
      setTripPlan(res.data);
      setActiveDay(1);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 5000);
    } catch (err) {
      const serverMsg = err.response?.data?.detail || err.message;
      setError(`Failed to generate plan: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapActivity = async (oldActivity, activityIndex) => {
    if (!tripPlan) return;
    setSwappingIndex(activityIndex);
    try {
      const currentDayActivities = currentDayData?.activities || [];
      const avoidTitles = currentDayActivities.map((a) => a.title);

      const res = await swapActivity({
        destination: tripPlan.destination,
        travel_month: travelMonth,
        budget_tier: budgetTier,
        vibe: vibe,
        time_of_day: oldActivity.time_of_day,
        current_activity_title: oldActivity.title,
        avoid_titles: avoidTitles,
      });

      const newActivity = res.data;

      setTripPlan((prev) => {
        if (!prev) return prev;
        const updatedItinerary = prev.itinerary.map((dayPlan) => {
          if (dayPlan.day !== activeDay) return dayPlan;
          const updatedActivities = [...dayPlan.activities];
          updatedActivities[activityIndex] = newActivity;
          return { ...dayPlan, activities: updatedActivities };
        });
        return { ...prev, itinerary: updatedItinerary };
      });
    } catch (err) {
      const serverMsg = err.response?.data?.detail || err.message;
      alert(`Failed to swap activity: ${serverMsg}`);
    } finally {
      setSwappingIndex(null);
    }
  };

  const handleDownloadPdf = async () => {
    setPdfExporting(true);
    await generateTripPdf(
      "printable-itinerary",
      `TripBuddy-${destination.replace(/\s+/g, "_")}-${travelMonth}.pdf`
    );
    setPdfExporting(false);
  };

  if (!user) {
    return <AuthModal onLoginSuccess={(userData) => setUser(userData)} />;
  }

  const currentDayData = tripPlan?.itinerary.find((d) => d.day === activeDay);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        user={user}
        onLogout={() => setUser(null)}
        onOpenSavedTrips={() => setSavedDrawerOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        {currentPage === "about" ? (
          <AboutPage onBack={() => setCurrentPage("planner")} />
        ) : (
          <>
            <HeroSearch
              destination={destination}
              setDestination={setDestination}
              userName={user.name}
            />

            <TripFilters
              destination={destination}
              setDestination={setDestination}
              travelMonth={travelMonth}
              setTravelMonth={setTravelMonth}
              durationDays={durationDays}
              setDurationDays={setDurationDays}
              budgetTier={budgetTier}
              setBudgetTier={setBudgetTier}
              vibe={vibe}
              setVibe={setVibe}
              dietary={dietary}
              setDietary={setDietary}
              pacing={pacing}
              setPacing={setPacing}
              travelGroup={travelGroup}
              setTravelGroup={setTravelGroup}
              transportPref={transportPref}
              setTransportPref={setTransportPref}
              onPlanTrip={handleGenerate}
              loading={loading}
            />

            <WeatherWidget destination={destination} />

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm rounded-2xl text-center">
                {error}
              </div>
            )}

            {saveSuccessNotice && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Itinerary generated and saved to your MySQL database!</span>
              </div>
            )}

            {tripPlan && (
              <section id="printable-itinerary" className="space-y-6">
                {/* Header Banner */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl transition-colors">
                  {tripPlan.hero_image_url && (
                    <div
                      className="absolute inset-0 opacity-10 dark:opacity-15 bg-cover bg-center pointer-events-none"
                      style={{ backgroundImage: `url(${tripPlan.hero_image_url})` }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">
                        {travelMonth} Trip Plan
                      </span>
                      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {tripPlan.destination} ({tripPlan.itinerary.length} Days)
                      </h2>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {tripPlan.recommended_month_note}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Currency Converter Selector */}
                      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <div className="px-2 text-slate-400">
                          <Coins className="w-3.5 h-3.5" />
                        </div>
                        {Object.keys(EXCHANGE_RATES).map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => setSelectedCurrency(curr)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-xl transition ${
                              selectedCurrency === curr
                                ? "bg-emerald-500 text-slate-950 shadow-sm"
                                : "text-slate-600 dark:text-slate-300 hover:text-emerald-500"
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>

                      {/* One-Click Share Button */}
                      <button
                        onClick={() => setShareModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
                      >
                        <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Share Plan</span>
                      </button>

                      {/* Download PDF Button */}
                      <button
                        onClick={handleDownloadPdf}
                        disabled={pdfExporting}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                      >
                        {pdfExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>{pdfExporting ? "Exporting..." : "Download in PDF"}</span>
                      </button>

                      {/* Total Budget Card with Selected Currency */}
                      <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-right min-w-[190px]">
                        <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                          Total Budget ({selectedCurrency})
                        </span>
                        <span className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                          {formatCurrency(tripPlan.total_estimated_budget_inr, selectedCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Budget Category Chips with Selected Currency */}
                  {tripPlan.budget_breakdown_inr && (
                    <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                      {Object.entries(tripPlan.budget_breakdown_inr).map(([category, cost]) => (
                        <div key={category} className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize block mb-0.5">{category}</span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                            {formatCurrency(cost, selectedCurrency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Day Navigation Tabs */}
                <DayTabs days={tripPlan.itinerary} activeDay={activeDay} setActiveDay={setActiveDay} />

                {/* Day Activities, Map, Stay, and Food Section */}
                {currentDayData && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <ActivityTimeline
                        activities={currentDayData.activities}
                        dayTheme={currentDayData.day_theme}
                        onSwapActivity={handleSwapActivity}
                        swappingIndex={swappingIndex}
                      />
                      <MapView activities={currentDayData.activities} />
                    </div>
                    <div className="space-y-6">
                      <StayCard stay={currentDayData.stay} />
                      <FoodCard foods={currentDayData.recommended_food} />
                    </div>
                  </div>
                )}

                {/* Interactive Budget Tweaker */}
                <BudgetTweaker
                  initialBreakdown={tripPlan.budget_breakdown_inr}
                  totalBudgetRaw={tripPlan.total_estimated_budget_inr}
                  durationDays={tripPlan.itinerary?.length || durationDays}
                />

                {/* Local Survival Phrases Card */}
                <LocalPhrasesCard destination={tripPlan.destination} />

                <PackingChecklist packingList={tripPlan.packing_checklist} />

                {tripPlan.practical_travel_tips && tripPlan.practical_travel_tips.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 transition-colors">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Buddy's Smart Travel Tips for {tripPlan.destination}
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 pt-1">
                      {tripPlan.practical_travel_tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800/60">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ReviewSection destination={tripPlan.destination} user={user} />
              </section>
            )}
          </>
        )}
      </main>

      {/* Modern Responsive Footer */}
      <Footer onNavigate={setCurrentPage} />

      {/* Floating Mascots, Modals & Drawers */}
      <DancingMascotLoader loading={loading} destination={destination} />
      <WalkingBuddy userName={user?.name} />
      <ShareTripModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        tripPlan={tripPlan}
        travelMonth={travelMonth}
      />
      <ChatAssistant
        destination={destination}
        currentTripContext={tripPlan ? JSON.stringify(tripPlan.itinerary) : ""}
      />
      <SavedTripsDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        userId={user?.id}
        onSelectTrip={(savedTrip) => {
          setTripPlan(savedTrip);
          if (savedTrip.destination) setDestination(savedTrip.destination);
          setActiveDay(1);
          setCurrentPage("planner");
        }}
      />
    </div>
  );
}