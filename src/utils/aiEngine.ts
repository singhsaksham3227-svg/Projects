import { WeatherData, AirQualityData } from '../api/weather';

export interface AIInsight {
  type: 'tip' | 'warning' | 'info';
  icon: string;
  title: string;
  message: string;
}

export interface WeatherScore {
  score: number;
  label: string;
  color: string;
}

export const generateAIInsights = (
  weather: WeatherData,
  aqi: AirQualityData
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;
  const uvIndex = weather.uv_index;
  const aqi_value = aqi.us_aqi;
  const isNight = weather.is_day === 0;
  const id = weather.weather[0].id;

  // UV warnings
  if (uvIndex >= 8) {
    insights.push({ type: 'warning', icon: '🌞', title: 'Extreme UV Risk', message: 'UV index is very high. Apply SPF 50+ sunscreen and limit sun exposure between 10am–4pm.' });
  } else if (uvIndex >= 5) {
    insights.push({ type: 'tip', icon: '🧴', title: 'Moderate UV Alert', message: `UV index is ${uvIndex}. Use sunscreen and wear sunglasses when going outside.` });
  }

  // Air quality
  if (aqi_value > 150) {
    insights.push({ type: 'warning', icon: '😷', title: 'Poor Air Quality', message: 'Air quality is unhealthy. Sensitive groups should avoid outdoor activities.' });
  } else if (aqi_value > 100) {
    insights.push({ type: 'info', icon: '💨', title: 'Moderate Air Quality', message: 'Air quality is acceptable, but some pollutants may affect sensitive groups.' });
  } else {
    insights.push({ type: 'tip', icon: '✅', title: 'Good Air Quality', message: 'Air quality is good. Great time for outdoor activities!' });
  }

  // Temperature tips
  if (temp >= 35) {
    insights.push({ type: 'warning', icon: '🔥', title: 'Extreme Heat', message: 'Stay hydrated and avoid strenuous outdoor activity. Heat stroke risk is elevated.' });
  } else if (temp >= 30) {
    insights.push({ type: 'tip', icon: '🌡️', title: 'Hot Conditions', message: 'Wear light clothing and carry water. Best to exercise in the early morning or evening.' });
  } else if (temp <= 0) {
    insights.push({ type: 'warning', icon: '🧊', title: 'Freezing Temperatures', message: 'Bundle up! Frostbite risk. Avoid prolonged exposure to the cold.' });
  } else if (temp <= 10) {
    insights.push({ type: 'info', icon: '🧥', title: 'Cold Weather', message: 'Wear warm layers. A jacket is recommended for outdoor activities.' });
  }

  // Rain
  if (id >= 500 && id < 600) {
    insights.push({ type: 'tip', icon: '☂️', title: 'Rain Expected', message: 'Carry an umbrella and wear waterproof shoes. Driving visibility may be reduced.' });
  }

  // Storm
  if (id >= 200 && id < 300) {
    insights.push({ type: 'warning', icon: '⛈️', title: 'Thunderstorm Alert', message: 'Severe weather expected. Avoid open areas and outdoor plans. Stay indoors if possible.' });
  }

  // Wind
  if (windSpeed > 50) {
    insights.push({ type: 'warning', icon: '💨', title: 'High Wind Warning', message: 'Strong winds detected. Secure loose objects and avoid driving tall vehicles.' });
  } else if (windSpeed > 30) {
    insights.push({ type: 'info', icon: '🌬️', title: 'Windy Conditions', message: 'Breezy outside. Hold on to your hat and be mindful of falling branches.' });
  }

  // Night
  if (isNight && temp < 15) {
    insights.push({ type: 'tip', icon: '🌙', title: 'Cool Night', message: 'Temperatures will drop tonight. Keep a light blanket handy.' });
  }

  // Good weather
  if (id === 800 && temp >= 18 && temp <= 28 && !isNight && aqi_value <= 100) {
    insights.push({ type: 'tip', icon: '🏃', title: 'Perfect Outdoor Day', message: 'Clear skies and pleasant temperatures — ideal for a run, walk, or outdoor plans!' });
  }

  return insights.slice(0, 4);
};

export const getWeatherScore = (weather: WeatherData, aqi: AirQualityData): WeatherScore => {
  let score = 100;
  const temp = weather.main.temp;
  const id = weather.weather[0].id;
  const uvIndex = weather.uv_index;
  const aqi_value = aqi.us_aqi;

  if (temp < 5 || temp > 38) score -= 30;
  else if (temp < 10 || temp > 32) score -= 15;
  if (id >= 200 && id < 300) score -= 40;
  else if (id >= 300 && id < 600) score -= 20;
  else if (id >= 600 && id < 700) score -= 25;
  if (uvIndex >= 8) score -= 20;
  else if (uvIndex >= 6) score -= 10;
  if (aqi_value > 150) score -= 25;
  else if (aqi_value > 100) score -= 10;

  score = Math.max(0, Math.min(100, score));
  
  let label = 'Excellent';
  let color = 'text-green-400';
  if (score < 40) { label = 'Poor'; color = 'text-red-400'; }
  else if (score < 60) { label = 'Fair'; color = 'text-orange-400'; }
  else if (score < 80) { label = 'Good'; color = 'text-yellow-400'; }

  return { score, label, color };
};
