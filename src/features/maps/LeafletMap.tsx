import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  coordinates?: [number, number];
  scenarioName?: string;
  locationType?: string;
  onSelectScenario?: (id: string) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  coordinates = [37.7749, -122.4194],
  scenarioName = 'Demonstration Study Intersection',
  locationType = 'Signalized Intersection',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        // Initialize Leaflet map
        const map = L.map(mapContainerRef.current, {
          center: coordinates,
          zoom: 16,
          zoomControl: true,
          attributionControl: true,
        });

        // Add OpenStreetMap tiles with required attribution
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        });

        tileLayer.on('tileerror', () => {
          // If offline or blocked by CSP, set fallback flag
          setMapError(true);
        });

        tileLayer.addTo(map);

        // Custom styled marker
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color: #0d9488; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(13,148,136,0.5); border: 2px solid white; font-size: 16px;">🚦</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker(coordinates, { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; padding: 4px;">
            <strong style="color: #0f172a; font-size: 13px;">${scenarioName}</strong><br/>
            <span style="color: #64748b;">${locationType}</span><br/>
            <div style="margin-top: 6px; padding: 4px 6px; background: #f0fdfa; border-radius: 4px; color: #0d9488; font-weight: 500;">
              Synthetic Study Node (Not Live Sensor Data)
            </div>
          </div>
        `);

        // Add simple study approach corridor buffer
        const approachCircle = L.circle(coordinates, {
          color: '#0d9488',
          fillColor: '#14b8a6',
          fillOpacity: 0.15,
          radius: 120,
        }).addTo(map);

        approachCircle.bindTooltip('Study Boundary (120m approach queue zone)');

        mapInstanceRef.current = map;
      } else {
        // Pan to updated coordinates
        mapInstanceRef.current.setView(coordinates, 16);
      }
    } catch (err) {
      console.warn('Leaflet initialization error:', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, scenarioName, locationType]);

  if (mapError) {
    return (
      <div className="w-full h-72 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl mb-3">
          🗺️
        </div>
        <h4 className="text-sm font-semibold text-slate-100">GIS Satellite Map Fallback</h4>
        <p className="text-xs text-slate-400 max-w-md mt-1">
          OpenStreetMap tiles could not be reached or network is offline. The schematic intersection model remains
          100% active and responsive above.
        </p>
        <div className="mt-3 text-[11px] font-mono text-teal-400 bg-slate-800/80 px-3 py-1 rounded-full border border-teal-500/30">
          Geographic Node: {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-900 dark:text-slate-100">{scenarioName}</span>
        <span className="ml-2 text-[10px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded font-mono">
          Synthetic Study Point
        </span>
      </div>

      <div ref={mapContainerRef} className="w-full h-72 z-10" />

      {/* Disclaimers & Attribution footer */}
      <div className="bg-slate-50 dark:bg-slate-900/90 px-3 py-1.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 flex justify-between items-center">
        <span>Synthetic urban geometry &middot; Illustrative academic coordinates</span>
        <span>Tiles &copy; OpenStreetMap</span>
      </div>
    </div>
  );
};
