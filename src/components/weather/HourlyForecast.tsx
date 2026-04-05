import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ForecastData } from '../../api/weather';
import { format } from 'date-fns';
import { WeatherIcon } from '../ui/WeatherIcon';
import { Clock } from 'lucide-react';
import { AreaChart, Area, YAxis, ResponsiveContainer } from 'recharts';

interface HourlyForecastProps {
  data: ForecastData;
  unit: 'metric' | 'imperial';
}

export function HourlyForecast({ data, unit }: HourlyForecastProps) {
  const hourlyData = data.list.slice(0, 16).map(item => ({
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    temp: Math.round(item.main.temp),
    pop: Math.round(item.pop * 100),
    iconId: item.weather[0].id,
    isNight: new Date(item.dt * 1000).getHours() < 6 || new Date(item.dt * 1000).getHours() > 18,
  }));

  return (
    <GlassCard className="w-full p-5 shrink-0 relative overflow-hidden" noHover>
      <div className="flex items-center gap-2 text-gray-300 mb-4">
        <Clock className="w-5 h-5 text-gray-400" />
        <h3 className="uppercase tracking-wider font-semibold text-sm">Hourly Forecast</h3>
      </div>

      <div className="relative w-full overflow-x-auto pb-2">
        {/* Background temperature sparkline */}
        <div className="absolute inset-x-0 top-6 bottom-8 pointer-events-none opacity-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 3', 'dataMax + 3']} hide />
              <Area type="monotone" dataKey="temp" stroke="#FBBF24" strokeWidth={2} fill="url(#tempGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-1 min-w-max px-2 relative z-10">
          {hourlyData.map((hour, idx) => (
            <div key={idx} className="flex flex-col items-center min-w-[62px] gap-1">
              <span className="text-gray-300 text-xs font-medium">{idx === 0 ? 'Now' : hour.time}</span>
              <WeatherIcon code={hour.iconId} isNight={hour.isNight} className="text-2xl my-1" />
              {hour.pop > 10 && (
                <span className="text-[10px] text-blue-300 font-semibold">{hour.pop}%</span>
              )}
              {hour.pop <= 10 && <span className="text-[10px] opacity-0">-</span>}
              <span className="text-white font-semibold text-base mt-8">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
