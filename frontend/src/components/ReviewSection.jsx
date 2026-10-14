import React, { useState, useEffect } from "react";
import { Star, MessageSquarePlus, User, Send, CheckCircle2 } from "lucide-react";
import { submitReview, fetchReviews } from "../services/api";

export default function ReviewSection({ destination, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [spotName, setSpotName] = useState("Overall Destination");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loadReviews = async () => {
    if (!destination) return;
    try {
      const res = await fetchReviews(destination);
      setReviews(res.data);
    } catch {
      // Keep existing list on failure
    }
  };

  useEffect(() => {
    loadReviews();
  }, [destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await submitReview({
        user_id: user?.id || 1,
        user_name: user?.name || "Fellow Traveler",
        destination,
        spot_name: spotName,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setSubmitted(true);
      await loadReviews();
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      alert("Failed to post review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
      {/* Header & Rating Metric */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> Traveler Ratings & Reviews
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Real Traveler Insights for {destination}</h3>
        </div>

        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(avgRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-700"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-extrabold text-white">{avgRating} / 5</span>
          <span className="text-xs text-slate-500">({reviews.length} reviews)</span>
        </div>
      </div>

      {/* Review Submission Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <MessageSquarePlus className="w-4 h-4 text-emerald-400" /> Share Your Experience & Travel Tips
        </h4>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Star Selection */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Your Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Spot/Topic Selector */}
          <div className="flex-1 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Specific Spot or Trip Aspect</label>
            <input
              type="text"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              placeholder="e.g. Sula Vineyards, Trimbakeshwar, Food..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Comment Box */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-semibold block">Comment / Advice</label>
          <textarea
            rows="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share must-visit spots, auto-rickshaw negotiation tips, or authentic local dishes..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="flex items-center justify-between">
          {submitted ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Review added to MySQL!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? "Submitting..." : "Post Review"}</span>
          </button>
        </div>
      </form>

      {/* Review List */}
      <div className="space-y-3 pt-2">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic text-center py-4">
            No reviews yet for {destination}. Be the first to share your tips!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">{rev.user_name}</span>
                  <span className="text-[10px] text-slate-500">
                    • {rev.spot_name}
                  </span>
                </div>

                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}