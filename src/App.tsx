import React, { useState, useEffect, useMemo } from 'react';
import { HourlyForecast } from './components/weather/HourlyForecast';
import { SevenDayForecast } from './components/weather/SevenDayForecast';
import { WeatherDetailCards } from './components/weather/WeatherDetailCards';
import { Header } from './components/layout/Header';
import { CurrentWeather } from './components/weather/CurrentWeather';
import { AirQualityWidget } from './components/weather/AirQualityWidget';
import { UVIndexWidget } from './components/weather/UVIndexWidget';
import { SunAndMoonWidget } from './components/weather/SunAndMoonWidget';
import { AllergyWidget } from './components/weather/AllergyWidget';
import { WeatherMapWidget } from './components/weather/WeatherMapWidget';
import { FeelsLikeInsightsWidget } from './components/weather/FeelsLikeInsightsWidget';
import { AIInsightsWidget } from './components/ai/AIInsightsWidget';
import { useStore } from './store/useStore';
import { 
  WeatherData, 
  ForecastData, 
  AirQualityData,
  fetchWeatherByLocation, 
  fetchForecast,
  fetchAirQuality,
  fetchWeatherByCity
} from './api/weather';
import { generateAIInsights } from './utils/aiEngine';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { unit, updateHistory } = useStore();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [aqiData, setAqiData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number, name?: string) => {
    try {
      setLoading(true);
      setError(null);
      const [current, fore, aqi] = await Promise.all([
        fetchWeatherByLocation(lat, lon, unit),
        fetchForecast(lat, lon, unit),
        fetchAirQuality(lat, lon)
      ]);
      
      setCurrentWeather(current);
      setForecast(fore);
      setAqiData(aqi);

      if (name) {
        updateHistory({ name, lat, lon, country: current.sys.country });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          fetchWeatherData(40.7128, -74.0060, 'New York');
        }
      );
    } else {
      fetchWeatherData(40.7128, -74.0060, 'New York');
    }
  };

  useEffect(() => {
    getUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const bgClass = useMemo(() => {
    if (!currentWeather) return 'bg-gradient-to-b from-[#0f172a] to-[#1e293b]';
    const isNight = currentWeather.is_day === 0;
    const weatherCode = currentWeather.weather[0].id;
    
    if (weatherCode >= 200 && weatherCode < 300) return isNight ? 'bg-gradient-to-br from-[#1a1c29] to-[#0f172a]' : 'bg-gradient-to-br from-[#1e293b] to-[#334155]';
    if (weatherCode >= 300 && weatherCode < 600) return isNight ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]' : 'bg-gradient-to-tr from-[#3b82f6] via-[#2563eb] to-[#1e40af]';
    if (weatherCode >= 600 && weatherCode < 700) return isNight ? 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]' : 'bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]';
    if (weatherCode >= 700 && weatherCode < 800) return isNight ? 'bg-gradient-to-b from-[#0f172a] to-[#1e293b]' : 'bg-gradient-to-br from-[#94a3b8] to-[#64748b]';
    if (weatherCode === 800) return isNight ? 'bg-gradient-to-b from-[#0B101E] to-[#1B2735]' : 'bg-gradient-to-br from-[#38bdf8] via-[#0ea5e9] to-[#0284c7]';
    
    return isNight ? 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155]' : 'bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#1d4ed8]';
  }, [currentWeather]);

  const insights = useMemo(() => {
    if (!currentWeather || !aqiData) return [];
    return generateAIInsights(currentWeather, aqiData);
  }, [currentWeather, aqiData]);

  return (
    <div className={`min-h-screen text-white overflow-x-hidden ${bgClass} transition-colors duration-1000`}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-black/10 blur-[150px]" />
      </div>

      <Header 
        onSelectLocation={(lat, lon, name) => fetchWeatherData(lat, lon, name)} 
        onGetCurrentLocation={getUserLocation}
      />

      <main className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-16 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <Loader2 className="w-12 h-12 text-white/50 animate-spin mb-4" />
            <span className="text-white/60 tracking-wider font-light animate-pulse">Initializing WeatherWise...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <div className="w-20 h-20 mb-6 opacity-80">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-light mb-2">Oops! Something went wrong.</h2>
            <p className="text-white/50 mb-8">{error}</p>
            <button 
              onClick={getUserLocation}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md rounded-full shadow-lg border border-white/10 text-sm font-medium tracking-wide"
            >
              Try Again
            </button>
          </div>
        ) : currentWeather && forecast && aqiData && (
          <div className="flex flex-col gap-6 w-full">
            
            <div className="xl:col-span-12">
              <CurrentWeather current={currentWeather} forecast={forecast} unit={unit} />
            </div>

            <div className="xl:col-span-12 mb-4">
              <AIInsightsWidget insights={insights} />
            </div>
            
            <div className="xl:col-span-12 w-full">
              <HourlyForecast data={forecast} unit={unit} />
            </div>

            <div className="xl:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <WeatherMapWidget lat={currentWeather.coord.lat} lon={currentWeather.coord.lon} />
              <AirQualityWidget data={aqiData} />
              <UVIndexWidget uvIndex={currentWeather.uv_index} />
              <FeelsLikeInsightsWidget data={currentWeather} unit={unit} />
              <SunAndMoonWidget sunrise={currentWeather.sys.sunrise} sunset={currentWeather.sys.sunset} />
              <AllergyWidget data={aqiData} />
              <WeatherDetailCards data={currentWeather} unit={unit} />
            </div>

            <div className="xl:col-span-12 w-full mt-2">
              <SevenDayForecast data={forecast} unit={unit} />
            </div>
            
          </div>
        )}
      </main>
    </div>
  );
}
