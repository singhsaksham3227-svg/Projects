import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { AirQualityData } from '../../api/weather';
import { Leaf } from 'lucide-react';

interface AllergyWidgetProps {
  data: AirQualityData;
}

const getPollenStatus = (level: number) => {
  if (level < 20) return { label: 'Low', color: 'text-green-400', bar: 'bg-green-400' };
  if (level < 50) return { label: 'Moderate', color: 'text-yellow-400', bar: 'bg-yellow-400' };
  if (level < 100) return { label: 'High', color: 'text-orange-400', bar: 'bg-orange-400' };
  return { label: 'Very High', color: 'text-red-400', bar: 'bg-red-400' };
};

export function AllergyWidget({ data }: AllergyWidgetProps) {
  const { pollen } = data;
  const values = [pollen.alder, pollen.birch, pollen.grass, pollen.ragweed, pollen.olive];
  const maxPollen = Math.max(...values, 0);
  const overall = getPollenStatus(maxPollen);

  const entries = [
    { name: 'Grass', val: pollen.grass },
    { name: 'Birch', val: pollen.birch },
    { name: 'Ragweed', val: pollen.ragweed },
    { name: 'Olive', val: pollen.olive },
  ];

  return (
    <GlassCard className="flex flex-col p-5 min-h-[200px] justify-between">
      <div className="flex items-center gap-2 text-gray-300">
        <Leaf className="w-5 h-5 text-gray-400" />
        <h3 className="uppercase tracking-wider font-semibold text-sm">Pollen</h3>
      </div>

      <div className="mt-3 mb-1">
        <span className="text-3xl font-light text-white">{overall.label}</span>
      </div>

      <div className="flex flex-col gap-2.5 mt-2">
        {entries.map(e => {
          const status = getPollenStatus(e.val);
          const pct = Math.max(Math.min((e.val / 150) * 100, 100), 2);
          return (
            <div key={e.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{e.name}</span>
                <span className={status.color}>{status.label}</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${status.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
