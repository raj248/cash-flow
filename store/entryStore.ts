import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { useCategoryStore } from './categoryStore';
import { useSettingsStore } from './settingsStore';

export type Entry = {
  id: string;
  userId?: string;
  categoryId: string | null;
  amount: number;
  date: string; // ISO format (YYYY-MM-DD:HH-MM-SS)
  note?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // optional for soft delete & sync
};

type EntryState = {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
  removeEntry: (id: string, soft?: boolean) => void;
  updateEntry: (id: string, updates: Partial<Omit<Entry, 'id' | 'createdAt'>>) => void;
  restoreEntry: (id: string) => void; // undo soft delete
  removeEntriesByCategory: (categoryId: string, removeAll?: boolean) => void;
  purgeTrash: () => void;
  getTodayEntries: () => Entry[];
  getEntriesByDate: (date: string) => Entry[];

  purgeExpired: (retentionDays: number) => void;
  setEntries: (entries: Entry[]) => void;
  populateDummyData: () => void;
};

export const useEntryStore = create<EntryState>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => {
          const newEntry: Entry = {
            ...entry,
            id: nanoid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { entries: [...state.entries, newEntry] };
        }),

      removeEntry: (id, soft = true) =>
        set((state) => {
          if (soft) {
            return {
              entries: state.entries.map((e) =>
                e.id === id ? { ...e, deletedAt: new Date().toISOString() } : e
              ),
            };
          } else {
            return {
              entries: state.entries.filter((e) => e.id !== id),
            };
          }
        }),

      // inside useEntryStore
      removeEntriesByCategory: (categoryId: string, removeAll = true) =>
        set((state) => ({
          entries: state.entries.map((e) => {
            if (e.categoryId !== categoryId) return e;
            return removeAll
              ? { ...e, deletedAt: new Date().toISOString() }
              : { ...e, categoryId: null }; // keep entry but unset category
          }),
        })),

      purgeTrash: () =>
        set((state) => ({
          entries: state.entries.filter((e) => !e.deletedAt),
        })),

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          ),
        })),

      restoreEntry: (id) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, deletedAt: undefined } : e)),
        })),

      getTodayEntries: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().entries.filter(
          (e) => e.date.split('T')[0] === today && !e.deletedAt // ignore soft-deleted
        );
      },

      getEntriesByDate: (date) => {
        const all = get().entries;
        return all.filter((e) => e.date.split('T')[0] === date && !e.deletedAt);
      },

      purgeExpired: (rententionDays) => {
        const now = new Date().getTime();
        // const cutoff = rententionDays * 60 * 1000;
        const cutoff = rententionDays * 24 * 60 * 60 * 1000;
        // console.log('cutoff', cutoff);

        set((state) => ({
          entries: state.entries.filter((e) => {
            if (!e.deletedAt) return true;
            const deletedAt = new Date(e.deletedAt).getTime();
            const verdict = now - deletedAt < cutoff;
            // console.log('verdict', verdict, e.id, deletedAt);
            return verdict; // keep only items newer than cutoff
          }),
        }));
      },

      setEntries: (entries) => set({ entries }),

      populateDummyData: () => {
        const categories = useCategoryStore.getState().categories;
        if (categories.length === 0) {
          console.warn('No categories found. Populate categories first.');
          return;
        }

        const dummyEntries: Entry[] = [];
        const now = new Date();

        // Loop through last 30 days
        for (let i = 0; i < 30; i++) {
          const day = new Date(now);
          day.setDate(now.getDate() - i);
          const dateStr = day.toISOString();

          // For each day, pick 1–3 random categories
          const numEntries = Math.floor(Math.random() * 5) + 1;
          for (let j = 0; j < numEntries; j++) {
            const category = categories[Math.floor(Math.random() * categories.length)];

            dummyEntries.push({
              id: nanoid(),
              categoryId: category.id,
              amount: Math.floor(Math.random() * 1000) + 50, // ₹50 – ₹1050
              date: dateStr,
              note: `Sample entry in ${category.name}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }

        set({ entries: dummyEntries });
      },
    }),
    {
      name: 'entry-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate entry store', error);
        } else if (state) {
          console.log('Rehydrated entry store successfully.');
          // Purge expired entries
          const retentionDays = useSettingsStore.getState().trashRetentionDays; // or get this from settings store
          state.purgeExpired(retentionDays);
        }
      },
    }
  )
);
