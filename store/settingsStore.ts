import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SettingsState = {
  trashRetentionDays: number;
  setTrashRetentionDays: (days: number) => void;
};

export const useSettingsStore = create(
  persist<SettingsState>(
    (set, get) => ({
      trashRetentionDays: 30, // default 30 days
      setTrashRetentionDays: (days) => set({ trashRetentionDays: days }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
