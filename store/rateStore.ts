import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backupToGitHub from '~/utils/backupToGitHub';

interface RateStore {
  data: Record<string, Record<string, [number, number]>>; // {'mm-yyyy': {'dd': [amt1, amt2]}}
  totals: Record<string, number>; // {'mm-yyyy': totalAmount}
  upsertEntry: (date: string, amt1: number, amt2: number) => void;
  getMonthData: (month: string) => Record<string, [number, number]> | null;
}

export const useRateStore = create(
  persist<RateStore>(
    (set, get) => ({
      data: {},
      totals: {},

      upsertEntry: (date, amt1, amt2) => {
        set((state) => {
          const [day, month, year] = date.split('-');
          const key = `${month}-${year}`;
          const newData: Record<string, Record<string, [number, number]>> = {
            ...state.data,
            [key]: {
              ...state.data[key],
              [day]: [amt1, amt2], // Updates if exists, inserts if new
            },
          };

          // Compute total asynchronously
          setTimeout(() => {
            const monthTotal = Object.values(newData[key] || {}).reduce(
              (sum, [a1, a2]) => sum + a1 * 2.5 + a2 * 2,
              0
            );
            set((state) => ({
              totals: { ...state.totals, [key]: monthTotal },
            }));
          }, 0);

          // Backup to GitHub after update
          setTimeout(async () => {
            await backupToGitHub();
          }, 2000); // Delay to avoid excessive API calls

          return { data: newData };
        });
      },

      getMonthData: (month) => get().data[month] || null,
    }),
    {
      name: 'rate-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
