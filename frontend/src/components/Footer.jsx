import React from "react";
import { 
  Compass, 
  Heart, 
  MapPin, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/durgesh8232",
      icon: Github,
      color: "hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-600",
    },
    {
      name: "Twitter / X",
      href: "https://twitter.com",
      icon: Twitter,
      color: "hover:text-sky-500 hover:border-sky-500/40",
    },
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: Instagram,
      color: "hover:text-pink-500 hover:border-pink-500/40",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: Linkedin,
      color: "hover:text-blue-500 hover:border-blue-500/40",
    },
  ];

  const quickLinks = [
    { label: "Trip Planner", page: "planner" },
    { label: "About TripBuddy", page: "about" },
  ];

  const popularDestinations = [
    "Nashik Wine & Temples",
    "Goa Beaches & Nightlife",
    "Manali Mountains & Snow",
    "Jaipur Royal Heritage",
    "Ujjain Mahakal & Ghats",
  ];

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info & Mission */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Trip<span className="text-emerald-500">Buddy</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your AI-powered Indian travel co-pilot. Smart day-by-day itineraries, authentic Unsplash photography, local cuisine gems, and strict pacing.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              <span>Smart Travel Made Effortless</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((item) => (
                <li key={item.page}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate(item.page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition flex items-center gap-1 group"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="#printable-itinerary"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                >
                  Current Itinerary
                </a>
              </li>
            </ul>
          </div>

          {/* Trending Travel Circuits */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Top Circuits
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              {popularDestinations.map((dest, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                  <span>{dest}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Profiles & Community */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Connect With Us
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Follow along for seasonal getaway tips, itinerary hacks, and travel inspiration.
            </p>

            <div className="flex items-center gap-2.5">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-all duration-200 ${social.color}`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            <div className="pt-1">
              <a
                href="mailto:contact@tripbuddy.app"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>durgeshsonar8232@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Tagline */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {currentYear} TripBuddy. Designed for travelers worldwide.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5 animate-pulse" />
            <span>for authentic Indian explorations</span>
          </div>
        </div>

      </div>
    </footer>
  );
}