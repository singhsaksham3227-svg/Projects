import axios from 'axios';

const FORECAST_API = 'https://api.open-meteo.com/v1';
const AQI_API = 'https://air-quality-api.open-meteo.com/v1';

export interface WeatherData {
  is_day: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: { id: number; main: string; description: string }[];
  wind: { speed: number; deg: number };
  visibility: number;
  coord: { lat: number; lon: number };
  sys: { sunrise: number; sunset: number; country: string };
  name: string;
  uv_index: number;
}

export interface AirQualityData {
  us_aqi: number;
  pm10: number;
  pm2_5: number;
  pollen: {
    alder: number;
    birch: number;
    grass: number;
    mugwort: number;
    olive: number;
    ragweed: number;
  };
}

export interface ForecastData {
  list: {
    dt: number;
    main: { temp: number };
    pop: number;
    weather: { id: number }[];
  }[];
  daily: {
    dt: number;
    temp_min: number;
    temp_max: number;
    weather: { id: number }[];
  }[];
}

// WMO weather code -> OWM-style id mapping
const wmoToId = (code: number): number => {
  if (code === 0) return 800;
  if (code <= 2) return 801;
  if (code === 3) return 804;
  if (code <= 49) return 741;
  if (code <= 57) return 300;
  if (code <= 67) return 501;
  if (code <= 77) return 601;
  if (code <= 82) return 520;
  if (code <= 86) return 621;
  if (code <= 99) return 211;
  return 800;
};

const wmoToDesc = (code: number): { main: string; description: string } => {
  if (code === 0) return { main: 'Clear', description: 'Clear sky' };
  if (code <= 2) return { main: 'Clouds', description: 'Partly cloudy' };
  if (code === 3) return { main: 'Clouds', description: 'Overcast' };
  if (code <= 49) return { main: 'Mist', description: 'Foggy' };
  if (code <= 57) return { main: 'Drizzle', description: 'Drizzle' };
  if (code <= 67) return { main: 'Rain', description: 'Rain' };
  if (code <= 77) return { main: 'Snow', description: 'Snow' };
  if (code <= 82) return { main: 'Rain', description: 'Rain showers' };
  if (code <= 86) return { main: 'Snow', description: 'Snow showers' };
  return { main: 'Thunderstorm', description: 'Thunderstorm' };
};

export const fetchWeatherByLocation = async (
  lat: number,
  lon: number,
  unit: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> => {
  const tempUnit = unit === 'metric' ? 'celsius' : 'fahrenheit';
  const windUnit = unit === 'metric' ? 'kmh' : 'mph';
  
  const res = await axios.get(
    `${FORECAST_API}/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,` +
    `surface_pressure,wind_speed_10m,wind_direction_10m,is_day,visibility` +
    `&daily=sunrise,sunset,uv_index_max` +
    `&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&timezone=auto`
  );

  // Reverse geocode city name
  let cityName = 'Your Location';
  let country = '';
  try {
    const geo = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { headers: { 'Accept-Language': 'en' } }
    );
    cityName = geo.data.address?.city || geo.data.address?.town || geo.data.address?.village || geo.data.address?.county || 'Your Location';
    country = geo.data.address?.country_code?.toUpperCase() || '';
  } catch { /* fallback */ }

  const c = res.data.current;
  const d = res.data.daily;
  const wmo = c.weather_code;
  const desc = wmoToDesc(wmo);

  return {
    is_day: c.is_day,
    main: {
      temp: c.temperature_2m,
      feels_like: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      pressure: c.surface_pressure,
    },
    weather: [{ id: wmoToId(wmo), main: desc.main, description: desc.description }],
    wind: { speed: c.wind_speed_10m, deg: c.wind_direction_10m },
    visibility: c.visibility ? c.visibility / 1000 : 10,
    coord: { lat, lon },
    sys: {
      sunrise: new Date(d.sunrise[0]).getTime() / 1000,
      sunset: new Date(d.sunset[0]).getTime() / 1000,
      country,
    },
    name: cityName,
    uv_index: d.uv_index_max[0] || 0,
  };
};

export const fetchForecast = async (
  lat: number,
  lon: number,
  unit: 'metric' | 'imperial' = 'metric'
): Promise<ForecastData> => {
  const tempUnit = unit === 'metric' ? 'celsius' : 'fahrenheit';
  
  const res = await axios.get(
    `${FORECAST_API}/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,precipitation_probability,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&temperature_unit=${tempUnit}&timezone=auto&forecast_days=7`
  );

  const h = res.data.hourly;
  const d = res.data.daily;

  return {
    list: h.time.map((t: string, i: number) => ({
      dt: new Date(t).getTime() / 1000,
      main: { temp: h.temperature_2m[i] },
      pop: (h.precipitation_probability[i] || 0) / 100,
      weather: [{ id: wmoToId(h.weather_code[i]) }],
    })),
    daily: d.time.map((t: string, i: number) => ({
      dt: new Date(t).getTime() / 1000,
      temp_min: d.temperature_2m_min[i],
      temp_max: d.temperature_2m_max[i],
      weather: [{ id: wmoToId(d.weather_code[i]) }],
    })),
  };
};

export const fetchAirQuality = async (lat: number, lon: number): Promise<AirQualityData> => {
  const res = await axios.get(
    `${AQI_API}/air-quality?latitude=${lat}&longitude=${lon}` +
    `&current=us_aqi,pm10,pm2_5` +
    `&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen` +
    `&timezone=auto`
  );

  const h = res.data.hourly;
  const currentHour = new Date().getHours();
  const idx = Math.max(0, h.time.findIndex((t: string) => new Date(t).getHours() === currentHour));

  return {
    us_aqi: res.data.current.us_aqi ?? 0,
    pm10: res.data.current.pm10 ?? 0,
    pm2_5: res.data.current.pm2_5 ?? 0,
    pollen: {
      alder: h.alder_pollen?.[idx] ?? 0,
      birch: h.birch_pollen?.[idx] ?? 0,
      grass: h.grass_pollen?.[idx] ?? 0,
      mugwort: h.mugwort_pollen?.[idx] ?? 0,
      olive: h.olive_pollen?.[idx] ?? 0,
      ragweed: h.ragweed_pollen?.[idx] ?? 0,
    },
  };
};

export const fetchWeatherByCity = async (
  city: string,
  unit: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData> => {
  const geoRes = await axios.get(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  const result = geoRes.data.results?.[0];
  if (!result) throw new Error('City not found');
  const data = await fetchWeatherByLocation(result.latitude, result.longitude, unit);
  data.name = `${result.name}, ${result.country}`;
  return data;
};
