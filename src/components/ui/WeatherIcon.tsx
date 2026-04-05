import React from 'react';
import { cn } from '../../utils/cn';

interface WeatherIconProps {
  code: number;
  isNight?: boolean;
  className?: string;
}

const getWeatherEmoji = (code: number, isNight: boolean): string => {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) {
    if (code === 500) return '🌦️';
    if (code >= 502) return '🌧️';
    return '🌧️';
  }
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return isNight ? '🌙' : '☀️';
  if (code === 801) return isNight ? '🌙' : '🌤️';
  if (code === 802) return '⛅';
  if (code >= 803) return '☁️';
  // Open-Meteo WMO codes
  if (code === 0) return isNight ? '🌙' : '☀️';
  if (code === 1 || code === 2) return isNight ? '🌙' : '🌤️';
  if (code === 3) return '☁️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95 && code <= 99) return '⛈️';
  return isNight ? '🌙' : '☀️';
};

export function WeatherIcon({ code, isNight = false, className }: WeatherIconProps) {
  const emoji = getWeatherEmoji(code, isNight);
  return (
    <span className={cn('text-2xl leading-none select-none', className)} role="img">
      {emoji}
    </span>
  );
}
