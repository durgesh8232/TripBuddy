import React, { useState } from "react";
import { Compass, ArrowRight } from "lucide-react";
import { authLogin, authRegister } from "../services/api";

export default function AuthModal({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        const res = await authRegister({ name, email, password });
        onLoginSuccess(res.data);
      } else {
        const res = await authLogin({ email, password });
        onLoginSuccess(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication failed. Check your MySQL connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">TripBuddy</h1>
            <p className="text-xs text-slate-400">Save your trips & plan in ₹ INR</p>
          </div>
        </div>

        {error && <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs text-slate-300 block mb-1">Your Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" placeholder="Durgesh" />
            </div>
          )}
          <div>
            <label className="text-xs text-slate-300 block mb-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" placeholder="user@gmail.com" />
          </div>
          <div>
            <label className="text-xs text-slate-300 block mb-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
            {isRegister ? "Create Free Account" : "Sign In to Plan"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button onClick={() => setIsRegister(!isRegister)} className="text-xs text-emerald-400 block text-center mt-4 hover:underline w-full">
          {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}