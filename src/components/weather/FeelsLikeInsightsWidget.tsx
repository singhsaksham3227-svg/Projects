import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { WeatherData } from '../../api/weather';
import { Thermometer } from 'lucide-react';

interface FeelsLikeInsightsWidgetProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

export function FeelsLikeInsightsWidget({ data, unit }: FeelsLikeInsightsWidgetProps) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const diff = feelsLike - temp;

  let insight = 'Similar to the actual temperature.';
  if (diff > 3) insight = 'Humidity is making it feel hotter than the actual temperature.';
  else if (diff < -3) insight = 'Wind chill is making it feel colder than the actual temperature.';

  return (
    <GlassCard className="flex flex-col p-5 min-h-[200px] justify-between">
      <div className="flex items-center gap-2 text-gray-300">
        <Thermometer className="w-5 h-5 text-gray-400" />
        <h3 className="uppercase tracking-wider font-semibold text-sm">Feels Like</h3>
      </div>

      <div className="flex flex-col mt-4">
        <span className="text-4xl font-light text-white">{feelsLike}°</span>
      </div>

      <p className="text-gray-400 text-sm mt-auto pt-3 border-t border-white/10 leading-relaxed">
        {insight}
      </p>
    </GlassCard>
  );
}
