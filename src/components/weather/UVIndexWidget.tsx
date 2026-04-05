import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Sun } from 'lucide-react';
import { cn } from '../../utils/cn';

interface UVIndexWidgetProps {
  uvIndex: number;
}

const getUVInfo = (uv: number) => {
  if (uv < 3) return { level: 'Low', color: 'text-green-400', bar: 'bg-green-400', advice: 'You can safely stay outside!', percent: (uv / 11) * 100 };
  if (uv < 6) return { level: 'Moderate', color: 'text-yellow-400', bar: 'bg-yellow-400', advice: 'Wear sunscreen & sunglasses.', percent: (uv / 11) * 100 };
  if (uv < 8) return { level: 'High', color: 'text-orange-400', bar: 'bg-orange-400', advice: 'Limit time in midday sun.', percent: (uv / 11) * 100 };
  if (uv < 11) return { level: 'Very High', color: 'text-red-400', bar: 'bg-red-400', advice: 'Extra protection essential.', percent: (uv / 11) * 100 };
  return { level: 'Extreme', color: 'text-purple-400', bar: 'bg-purple-400', advice: 'Avoid sun. Stay indoors.', percent: 100 };
};

export function UVIndexWidget({ uvIndex }: UVIndexWidgetProps) {
  const info = getUVInfo(uvIndex);

  return (
    <GlassCard className="flex flex-col p-5 min-h-[200px] justify-between">
      <div className="flex items-center gap-2 text-gray-300">
        <Sun className="w-5 h-5 text-gray-400" />
        <h3 className="uppercase tracking-wider font-semibold text-sm">UV Index</h3>
      </div>

      <div className="flex flex-col mt-4">
        <span className="text-4xl font-light text-white">{Math.round(uvIndex)}</span>
        <span className={cn('text-sm font-semibold mt-1', info.color)}>{info.level}</span>
      </div>

      <div className="mt-4 w-full">
        <div className="h-1.5 w-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-purple-500 rounded-full overflow-hidden relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-white/80 transition-all duration-700"
            style={{ left: `calc(${info.percent}% - 8px)` }}
          />
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-3 pt-3 border-t border-white/10">{info.advice}</p>
    </GlassCard>
  );
}
