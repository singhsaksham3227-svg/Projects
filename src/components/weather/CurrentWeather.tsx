import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { WeatherData, ForecastData } from '../../api/weather';
import { MapPin } from 'lucide-react';
import { WeatherIcon } from '../ui/WeatherIcon';
import { format } from 'date-fns';

interface CurrentWeatherProps {
  current: WeatherData;
  forecast: ForecastData;
  unit: 'metric' | 'imperial';
}

export function CurrentWeather({ current, forecast, unit }: CurrentWeatherProps) {
  const isNight = current.is_day === 0;
  const temp = Math.round(current.main.temp);
  const feelsLike = Math.round(current.main.feels_like);
  const tempUnit = unit === 'metric' ? '°C' : '°F';

  const todayForecast = forecast.daily[0];
  const maxTemp = todayForecast ? Math.round(todayForecast.temp_max) : temp;
  const minTemp = todayForecast ? Math.round(todayForecast.temp_min) : temp;

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 mb-2">
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-3xl font-medium tracking-wide text-white drop-shadow-md">{current.name}</h2>
        <div className="flex items-center text-gray-200 text-xs opacity-90 font-medium tracking-wide mt-1">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{format(new Date(), 'EEEE, h:mm a')}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-6">
        <div className="flex items-start pl-8">
          <span className="text-[120px] leading-none font-extralight tracking-tighter drop-shadow-2xl text-white">
            {temp}°
          </span>
        </div>
        <div className="flex items-center gap-3 mt-4 text-white drop-shadow-md">
          <WeatherIcon code={current.weather[0].id} isNight={isNight} className="text-4xl" />
          <span className="text-2xl font-light capitalize">{current.weather[0].description}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6 text-white/90 text-sm font-medium tracking-wide backdrop-blur-md bg-black/10 px-6 py-2 rounded-full border border-white/10 shadow-inner">
        <span className="flex items-center gap-1"><span className="text-white/60">H:</span>{maxTemp}°</span>
        <div className="w-[1px] h-3 bg-white/20" />
        <span className="flex items-center gap-1"><span className="text-white/60">L:</span>{minTemp}°</span>
        <div className="w-[1px] h-3 bg-white/20" />
        <span>Feels like {feelsLike}°</span>
      </div>

      <div className="mt-6 max-w-sm text-center">
        <p className="text-white/80 leading-relaxed font-light text-sm">
          Generally {current.weather[0].description} conditions expected. High of {maxTemp}° and low of {minTemp}°.
        </p>
      </div>
    </div>
  );
}
