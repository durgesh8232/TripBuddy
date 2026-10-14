import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin } from "lucide-react";

// Fix default marker icons in Vite/bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapView({ activities = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const validStops = activities.filter(
    (act) => act.latitude && act.longitude && act.latitude !== 0 && act.longitude !== 0
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Leaflet instance once
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([20.5937, 78.9629], 5);

      // Fast, reliable OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (validStops.length > 0) {
      const latLngs = [];

      validStops.forEach((stop, index) => {
        const point = [stop.latitude, stop.longitude];
        latLngs.push(point);

        // Numbered custom HTML marker
        const numberedIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              background: #10b981;
              color: #020617;
              font-weight: 800;
              font-size: 13px;
              border-radius: 50%;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
            ">
              ${index + 1}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        });

        const popupHtml = `
          <div style="font-family: inherit; color: #0f172a; min-width: 180px; padding: 2px;">
            <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #059669;">
              Stop ${index + 1} • ${stop.time_of_day || "Activity"}
            </div>
            <div style="font-size: 14px; font-weight: 700; margin-top: 2px; color: #0f172a;">
              ${stop.title}
            </div>
            <p style="font-size: 11px; color: #64748b; margin: 4px 0 6px 0; line-height: 1.3;">
              ${stop.description ? stop.description.substring(0, 90) + "..." : ""}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px; font-size: 11px;">
              <span style="font-weight: 700; color: #059669;">${stop.estimated_cost_inr || "Free"}</span>
              <span style="color: #64748b;">${stop.transit_tip ? stop.transit_tip.substring(0, 30) : ""}</span>
            </div>
          </div>
        `;

        const marker = L.marker(point, { icon: numberedIcon }).bindPopup(popupHtml);
        layerGroup.addLayer(marker);
      });

      // Connecting polyline
      if (latLngs.length > 1) {
        layerGroup.addLayer(
          L.polyline(latLngs, { color: "#059669", weight: 6, opacity: 0.3 })
        );
        layerGroup.addLayer(
          L.polyline(latLngs, { color: "#34d399", weight: 3.5, opacity: 0.9, dashArray: "6, 8" })
        );
      }

      // Auto-fit bounds
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
    }

    // 2. Fix grey tiles: Force Leaflet to recalculate when container finishes rendering
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Staggered fallback recalculation
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 400);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [activities]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>Optimized Daily Route Map</span>
        </div>
        <span className="text-xs text-slate-400">
          {validStops.length} stops sequenced (No Backtracking)
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-80 w-full z-10 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "320px", width: "100%" }} />
      </div>

      {validStops.length === 0 && (
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-600" />
          <span>Coordinates pending for this destination's stops.</span>
        </div>
      )}
    </div>
  );
}