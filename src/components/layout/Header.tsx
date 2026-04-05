import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Mic, Thermometer } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HeaderProps {
  onSelectLocation: (lat: number, lon: number, name: string) => void;
  onGetCurrentLocation: () => void;
}

interface GeoResult {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

export function Header({ onSelectLocation, onGetCurrentLocation }: HeaderProps) {
  const { unit, changeUnit } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch { setResults([]); }
    }, 300);
  }, [query]);

  const handleSelect = (r: GeoResult) => {
    onSelectLocation(r.latitude, r.longitude, `${r.name}, ${r.country}`);
    setQuery(`${r.name}, ${r.country}`);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/20 border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 flex items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
              <path d="M17.5 19C19.985 19 22 16.985 22 14.5C22 12.136 20.177 10.203 17.868 10.02C17.433 6.643 14.536 4 11 4C7.134 4 4 7.134 4 11C4 11.237 4.012 11.47 4.035 11.698C2.302 12.35 1 14.024 1 16C1 18.209 2.791 20 5 20H17.5V19Z"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight hidden sm:block">WeatherWise</h1>
        </div>

        <div className="flex-1 relative max-w-xl">
          <div className="flex items-center gap-3 bg-white/10 rounded-full px-5 py-2.5 border border-white/10 focus-within:border-white/30 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400 text-sm"
            />
            <button onClick={onGetCurrentLocation} title="Use my location">
              <MapPin className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>

          {showDropdown && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white/10 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-white text-sm font-medium">{r.name}</span>
                    <span className="text-gray-400 text-xs ml-2">{r.admin1 ? `${r.admin1}, ` : ''}{r.country}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 border border-white/10 shrink-0">
          <button
            onClick={() => changeUnit('metric')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${unit === 'metric' ? 'bg-white text-black shadow' : 'text-white/60 hover:text-white'}`}
          >
            °C
          </button>
          <button
            onClick={() => changeUnit('imperial')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${unit === 'imperial' ? 'bg-white text-black shadow' : 'text-white/60 hover:text-white'}`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
