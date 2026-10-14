import React from "react";
import { Sun, Moon, Compass, Bookmark, Info, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({
  user,
  onLogout,
  onOpenSavedTrips,
  currentPage,
  onNavigate,
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate("planner")}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            Trip<span className="text-emerald-500">Buddy</span>
          </span>
        </div>

        {/* Right Navigation & Theme Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-xs font-semibold">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="hidden md:inline text-xs font-semibold">Dark</span>
              </>
            )}
          </button>

          {/* Navigation Links */}
          <button
            type="button"
            onClick={() => onNavigate(currentPage === "planner" ? "about" : "planner")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 transition"
          >
            <Info className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">
              {currentPage === "planner" ? "About Us" : "Trip Planner"}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenSavedTrips}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Saved Trips</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}