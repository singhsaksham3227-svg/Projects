import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Sunset } from 'lucide-react';
import { format } from 'date-fns';
import { getLunarData } from '../../utils/astronomy';

interface SunAndMoonWidgetProps {
  sunrise: number;
  sunset: number;
}

export function SunAndMoonWidget({ sunrise, sunset }: SunAndMoonWidgetProps) {
  const sunriseDate = new Date(sunrise * 1000);
  const sunsetDate = new Date(sunset * 1000);
  const now = new Date();

  const totalDaylight = sunset - sunrise;
  const currentProgress = (now.getTime() / 1000) - sunrise;
  let rawPercentage = (currentProgress / totalDaylight) * 100;
  if (rawPercentage < 0) rawPercentage = 0;
  if (rawPercentage > 100) rawPercentage = 100;

  const angle = (rawPercentage / 100) * Math.PI;
  const radius = 40;
  const x = 50 - radius * Math.cos(angle);
  const y = 50 - radius * Math.sin(angle);

  const moon = getLunarData(now);

  return (
    <GlassCard className="flex flex-col p-5 min-h-[220px] justify-between">
      <div className="flex items-center justify-between gap-2 text-gray-300">
        <div className="flex items-center gap-2">
          <Sunset className="w-5 h-5 text-gray-400" />
          <h3 className="uppercase tracking-wider font-semibold text-xs">Sun & Moon</h3>
        </div>
        <span className="text-xs bg-black/20 px-2 py-0.5 rounded-md text-gray-300">
          {moon.iconType} {moon.illumination}%
        </span>
      </div>

      <div className="flex flex-col items-center flex-1 justify-center">
        <svg viewBox="0 0 100 60" className="w-full max-w-[180px] h-auto overflow-visible">
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeDasharray="4 4" />
          <path d={`M 10 50 A 40 40 0 0 1 ${x} ${y}`} fill="none" stroke="#FBBF24" strokeWidth="3" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx={x} cy={y} r="5" fill="#FBBF24" style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.9))' }} />
        </svg>
        <span className="text-xs text-gray-400 mt-1">{moon.phase}</span>
      </div>

      <div className="flex justify-between w-full text-xs">
        <div><span className="block text-gray-400">Sunrise</span><span className="text-white font-medium text-sm">{format(sunriseDate, 'HH:mm')}</span></div>
        <div className="text-right"><span className="block text-gray-400">Sunset</span><span className="text-white font-medium text-sm">{format(sunsetDate, 'HH:mm')}</span></div>
      </div>
    </GlassCard>
  );
}
