import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { WeatherData } from '../../api/weather';
import { Droplets, Wind, Eye, Gauge } from 'lucide-react';

interface WeatherDetailCardsProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

export function WeatherDetailCards({ data, unit }: WeatherDetailCardsProps) {
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';
  const windDeg = data.wind.deg;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const windDir = directions[Math.round(windDeg / 45) % 8];
  const dewPoint = Math.round(data.main.temp - ((100 - data.main.humidity) / 5));

  const cards = [
    {
      icon: <Droplets className="w-5 h-5 text-gray-400" />,
      label: 'Humidity',
      value: `${data.main.humidity}%`,
      detail: `Dew point is ${dewPoint}°`,
    },
    {
      icon: <Wind className="w-5 h-5 text-gray-400" />,
      label: 'Wind',
      value: `${Math.round(data.wind.speed)}`,
      unit: windUnit,
      detail: `${windDir} direction`,
    },
    {
      icon: <Gauge className="w-5 h-5 text-gray-400" />,
      label: 'Pressure',
      value: `${Math.round(data.main.pressure)}`,
      unit: 'hPa',
      detail: 'Sea level',
    },
    {
      icon: <Eye className="w-5 h-5 text-gray-400" />,
      label: 'Visibility',
      value: `${data.visibility?.toFixed(1) ?? '10.0'}`,
      unit: 'km',
      detail: Number(data.visibility) >= 10 ? 'Perfectly clear' : Number(data.visibility) >= 5 ? 'Good' : 'Limited',
    },
  ];

  return (
    <>
      {cards.map((card, i) => (
        <GlassCard key={i} className="flex flex-col p-5 min-h-[160px] justify-between">
          <div className="flex items-center gap-2 text-gray-300">
            {card.icon}
            <h3 className="uppercase tracking-wider font-semibold text-sm">{card.label}</h3>
          </div>
          <div className="flex flex-col mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-white">{card.value}</span>
              {card.unit && <span className="text-gray-400 text-sm">{card.unit}</span>}
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-auto pt-3">{card.detail}</p>
        </GlassCard>
      ))}
    </>
  );
}
