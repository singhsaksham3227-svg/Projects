import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ForecastData } from '../../api/weather';
import { format } from 'date-fns';
import { WeatherIcon } from '../ui/WeatherIcon';
import { CalendarDays } from 'lucide-react';

interface SevenDayForecastProps {
  data: ForecastData;
  unit: 'metric' | 'imperial';
}

export function SevenDayForecast({ data, unit }: SevenDayForecastProps) {
  const daily = data.daily.slice(0, 7);
  const globalMin = Math.min(...daily.map(d => d.temp_min));
  const globalMax = Math.max(...daily.map(d => d.temp_max));
  const rangeScale = globalMax - globalMin || 1;

  return (
    <GlassCard className="w-full p-5" noHover>
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <CalendarDays className="w-5 h-5 text-gray-400" />
        <h3 className="uppercase tracking-wider font-semibold text-sm">7-Day Forecast</h3>
      </div>

      <div className="flex flex-col gap-1">
        {daily.map((day, idx) => {
          const date = new Date(day.dt * 1000);
          const dateStr = idx === 0 ? 'Today' : format(date, 'EEEE');
          const min = Math.round(day.temp_min);
          const max = Math.round(day.temp_max);
          const barWidth = Math.max(((max - globalMin) / rangeScale) * 100, 10);

          return (
            <div key={idx} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
              <span className="w-24 font-medium text-white/90 shrink-0">{dateStr}</span>
              <div className="w-10 flex justify-center shrink-0">
                <WeatherIcon code={day.weather[0].id} className="text-xl" />
              </div>
              <span className="text-gray-400 w-10 text-right font-medium shrink-0">{min}°</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[200px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="text-white w-10 font-semibold shrink-0">{max}°</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
