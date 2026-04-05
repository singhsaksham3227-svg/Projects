import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { AirQualityData } from '../../api/weather';
import { Wind } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AirQualityWidgetProps {
  data: AirQualityData;
}

const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-400', bar: 'bg-green-400' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bar: 'bg-yellow-400' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400', bar: 'bg-orange-400' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400', bar: 'bg-red-400' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400', bar: 'bg-purple-400' };
  return { label: 'Hazardous', color: 'text-rose-700', bar: 'bg-rose-700' };
};

export function AirQualityWidget({ data }: AirQualityWidgetProps) {
  const info = getAqiInfo(data.us_aqi);
  const percent = Math.min((data.us_aqi / 300) * 100, 100);

  return (
    <GlassCard className="flex flex-col p-5 min-h-[200px] justify-between">
      <div className="flex items-center gap-2 text-gray-300">
        <Wind className="w-5 h-5 text-gray-400" />
        <h3 className="uppercase tracking-wider font-semibold text-sm">Air Quality</h3>
      </div>

      <div className="flex flex-col mt-4">
        <span className="text-4xl font-light text-white">{data.us_aqi}</span>
        <span className={cn('text-sm font-semibold mt-1 leading-tight', info.color)}>{info.label}</span>
      </div>

      <div className="mt-4 w-full">
        <div className="h-1.5 w-full rounded-full overflow-hidden relative bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 opacity-40" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-white/80 transition-all duration-700"
            style={{ left: `calc(${percent}% - 8px)` }}
          />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-400 pt-3 mt-2 border-t border-white/10">
        <div><span className="block text-gray-500">PM2.5</span><span className="text-white font-medium">{data.pm2_5.toFixed(1)}</span></div>
        <div className="text-right"><span className="block text-gray-500">PM10</span><span className="text-white font-medium">{data.pm10.toFixed(1)}</span></div>
      </div>
    </GlassCard>
  );
}
