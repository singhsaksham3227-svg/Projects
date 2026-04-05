// Astronomy utilities for calculating Moon Phase locally without an API

export type MoonPhase =
  | 'New Moon'
  | 'Waxing Crescent'
  | 'First Quarter'
  | 'Waxing Gibbous'
  | 'Full Moon'
  | 'Waning Gibbous'
  | 'Last Quarter'
  | 'Waning Crescent';

export interface LunarData {
  phase: MoonPhase;
  illumination: number;
  iconType: string;
}

export const getLunarData = (date: Date = new Date()): LunarData => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const c = Math.floor(year / 100);
  const e = 2 - c + Math.floor(c / 4);
  const jd =
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    e -
    1524.5;

  const cycles = (jd - 2451549.5) / 29.53058868;
  const phaseValue = cycles - Math.floor(cycles);

  let illumination = 0;
  if (phaseValue <= 0.5) {
    illumination = phaseValue * 200;
  } else {
    illumination = (1.0 - phaseValue) * 200;
  }

  let phase: MoonPhase = 'New Moon';
  let iconType = '🌑';

  if (phaseValue < 0.03 || phaseValue > 0.97) { phase = 'New Moon'; iconType = '🌑'; }
  else if (phaseValue < 0.22) { phase = 'Waxing Crescent'; iconType = '🌒'; }
  else if (phaseValue < 0.28) { phase = 'First Quarter'; iconType = '🌓'; }
  else if (phaseValue < 0.47) { phase = 'Waxing Gibbous'; iconType = '🌔'; }
  else if (phaseValue < 0.53) { phase = 'Full Moon'; iconType = '🌕'; }
  else if (phaseValue < 0.72) { phase = 'Waning Gibbous'; iconType = '🌖'; }
  else if (phaseValue < 0.78) { phase = 'Last Quarter'; iconType = '🌗'; }
  else { phase = 'Waning Crescent'; iconType = '🌘'; }

  return {
    phase,
    illumination: Math.round(illumination),
    iconType,
  };
};
