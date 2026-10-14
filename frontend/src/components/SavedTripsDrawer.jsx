import React, { useEffect, useState } from "react";
import { X, Calendar, MapPin, IndianRupee, Trash2, FolderOpen, Loader2 } from "lucide-react";
import { fetchUserTrips, deleteUserTrip } from "../services/api";

export default function SavedTripsDrawer({ isOpen, onClose, userId, onSelectTrip }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadTrips();
    }
  }, [isOpen, userId]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const res = await fetchUserTrips(userId);
      setTrips(res.data || []);
    } catch (err) {
      console.error("Failed to load saved trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, tripId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this saved itinerary?")) return;
    setDeletingId(tripId);
    try {
      await deleteUserTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-lg text-white">My Saved Itineraries</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span className="text-xs">Fetching your saved trips from MySQL...</span>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">No saved trips yet.</p>
              <p className="text-xs text-slate-600">Plans you generate will automatically appear here.</p>
            </div>
          ) : (
            trips.map((t) => {
              const tripData = t.trip_data;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTrip(tripData);
                    onClose();
                  }}
                  className="group cursor-pointer bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition hover:shadow-lg hover:shadow-emerald-500/5 relative space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition">
                        {t.destination}
                      </h4>
                      <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-emerald-400" /> {t.travel_month} • {t.duration_days} Days
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, t.id)}
                      disabled={deletingId === t.id}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-900 transition"
                      title="Delete trip"
                    >
                      {deletingId === t.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {tripData?.total_estimated_budget_inr && (
                    <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Est. Total</span>
                      <span className="font-semibold text-emerald-400 flex items-center">
                        <IndianRupee className="w-3 h-3 inline" />
                        {tripData.total_estimated_budget_inr.replace("₹", "")}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 text-xs text-center text-slate-500">
          Saved securely in your local MySQL database.
        </div>
      </div>
    </div>
  );
}