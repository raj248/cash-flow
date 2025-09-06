import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { nanoid } from 'nanoid/non-secure';
import { useCategoryStore } from './categoryStore';

export type Entry = {
  id: string;
  userId?: string;
  categoryId: string;
  amount: number;
  date: string; // ISO format (YYYY-MM-DD)
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

      populateDummyData: () => {
        const categories = useCategoryStore.getState().categories;
        if (categories.length === 0) {
          console.warn('No categories found. Populate categories first.');
          return;
        }
        const now = new Date();
        const dummyEntries: Entry[] = [
          {
            id: nanoid(),
            categoryId: categories[0].id,
            amount: 300,
            date: now.toISOString().split('T')[0],
            note: 'Dinner with friends',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          },
          {
            id: nanoid(),
            categoryId: categories[1].id,
            amount: 50,
            date: now.toISOString().split('T')[0],
            note: 'Bus ticket',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          },
          {
            id: nanoid(),
            categoryId: categories[2].id,
            amount: 2000,
            date: now.toISOString().split('T')[0],
            note: 'Monthly salary',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          },
          {
            id: nanoid(),
            categoryId: categories[3].id,
            amount: 500,
            date: now.toISOString().split('T')[0],
            note: 'Freelance project',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          },
        ];
        set({ entries: dummyEntries });
      },
    }),
    {
      name: 'entry-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
