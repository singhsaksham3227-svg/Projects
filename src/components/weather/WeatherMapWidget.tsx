import React, { useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Map } from 'lucide-react';

interface WeatherMapWidgetProps {
  lat: number;
  lon: number;
}

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lon]); }, [lat, lon, map]);
  return null;
}

export function WeatherMapWidget({ lat, lon }: WeatherMapWidgetProps) {
  return (
    <GlassCard className="col-span-2 p-1 overflow-hidden relative" style={{ minHeight: '280px' }} noHover>
      <div className="absolute top-4 left-4 z-[500] flex items-center gap-2 bg-black/70 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 shadow-lg pointer-events-none">
        <Map className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold tracking-wider text-white">RADAR</span>
      </div>
      <div className="w-full h-full rounded-2xl overflow-hidden" style={{ minHeight: '276px' }}>
        <MapContainer
          center={[lat, lon]}
          zoom={9}
          scrollWheelZoom={false}
          style={{ height: '276px', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[lat, lon]} icon={customIcon} />
          <RecenterMap lat={lat} lon={lon} />
        </MapContainer>
      </div>
    </GlassCard>
  );
}
