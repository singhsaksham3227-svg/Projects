import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LocationHistory {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface StoreState {
  unit: 'metric' | 'imperial';
  changeUnit: (unit: 'metric' | 'imperial') => void;
  history: LocationHistory[];
  updateHistory: (item: LocationHistory) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      unit: 'metric',
      changeUnit: (unit) => set({ unit }),
      history: [],
      updateHistory: (item) =>
        set((state) => ({
          history: [
            item,
            ...state.history.filter((i) => i.name !== item.name),
          ].slice(0, 5),
        })),
    }),
    { name: 'weatherwise-store' }
  )
);
