import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsState {
  textSize: number;
  setTextSize: (size: number) => void;
}

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      textSize: 12, // Default size (matches `text-xs`)
      setTextSize: (size) => set({ textSize: size }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
