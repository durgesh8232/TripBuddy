import React, { useEffect, useState } from "react";
import { getDestinationWeather } from "../services/weatherService";
import { CloudSun, Wind, Droplets, Thermometer, Sparkles } from "lucide-react";

export default function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!destination || destination.trim().length < 2) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await getDestinationWeather(destination);
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    }, 500); // 500ms debounce to avoid spamming while typing

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [destination]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 py-1 animate-pulse">
        <CloudSun className="w-4 h-4 text-emerald-400" />
        <span>Checking live weather for {destination}...</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
      <div className="flex items-center gap-3">
        <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-800">{weather.icon}</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{weather.cityName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Live Forecast
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {weather.label} • {weather.temperature}°C (Day: {weather.tempMax}°C / Night: {weather.tempMin}°C)
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>{weather.humidity}% Humidity</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-3.5 h-3.5 text-emerald-400" />
          <span>{weather.windSpeed} km/h Wind</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-slate-300 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="truncate max-w-xs">{weather.packTip}</span>
        </div>
      </div>
    </div>
  );
}