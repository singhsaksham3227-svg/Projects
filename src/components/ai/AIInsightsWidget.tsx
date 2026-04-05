import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { AIInsight } from '../../utils/aiEngine';
import { Sparkles } from 'lucide-react';
import { WeatherData, AirQualityData } from '../../api/weather';
import { getWeatherScore } from '../../utils/aiEngine';

interface AIInsightsWidgetProps {
  insights: AIInsight[];
  weather?: WeatherData;
  aqi?: AirQualityData;
}

export function AIInsightsWidget({ insights, weather, aqi }: AIInsightsWidgetProps) {
  const score = weather && aqi ? getWeatherScore(weather, aqi) : null;

  return (
    <GlassCard className="w-full p-5" noHover>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-300">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="uppercase tracking-wider font-semibold text-sm">AI Insights</h3>
        </div>
        {score && (
          <div className="flex items-center gap-2 bg-black/20 rounded-full px-3 py-1">
            <span className="text-xs text-gray-400">Weather Score</span>
            <span className={`text-lg font-bold ${score.color}`}>{score.score}</span>
            <span className={`text-xs font-medium ${score.color}`}>{score.label}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex gap-3 p-3 rounded-xl border ${
              insight.type === 'warning'
                ? 'bg-orange-500/10 border-orange-500/20'
                : insight.type === 'tip'
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-2xl shrink-0">{insight.icon}</span>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{insight.title}</p>
              <p className="text-gray-400 text-xs leading-relaxed mt-0.5">{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
