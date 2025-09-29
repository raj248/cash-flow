// store/categoryStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { create } from 'zustand';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid/non-secure';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useSettingsStore } from './settingsStore';

export type Category = {
  id: string; // unique identifier
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // <-- added for soft delete

  userId?: string; // optional, useful when syncing
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string; // Feather icon name
  iconImage?: string; // local file path to custom image
};

type CategoryState = {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeCategory: (id: string, soft?: boolean, handleEntries?: (id: string) => void) => void; // <-- soft flag
  purgeTrash: () => void;
  restoreCategory: (id: string) => void;
  getCategoryIcon: (id: string) => { icon?: string; iconImage?: string; color?: string } | null;
  setCategories: (cats: Category[]) => void;
  purgeExpired: (retentionDays: number) => void;
  populateDummyData: () => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],

      addCategory: (category) =>
        set((state) => {
          const newCategory: Category = {
            ...category,
            id: nanoid(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { categories: [...state.categories, newCategory] };
        }),

      removeCategory: (id, soft = true, handleEntries?: (id: string) => void) => {
        const categoryToRemove = get().categories.find((c) => c.id === id);
        if (!categoryToRemove) return;

        // soft delete
        if (soft) {
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? { ...c, deletedAt: new Date().toISOString() } : c
            ),
          }));
        } else {
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
          }));
        }
        if (handleEntries) {
          handleEntries(id); // ask entryStore what to do
        }
      },

      purgeTrash: () =>
        set((state) => ({
          categories: state.categories.filter((cat) => !cat.deletedAt),
        })),

      restoreCategory: (id) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, deletedAt: undefined } : c
          ),
        })),

      getCategoryIcon: (id) => {
        const category = get().categories.find((c) => c.id === id);
        if (!category) return null;

        return {
          icon: category.icon,
          iconImage: category.iconImage,
          color: category.color,
        };
      },

      setCategories: (cats) => set({ categories: cats }),

      purgeExpired: (retentionDays) => {
        const now = new Date().getTime();
        const cutoff = retentionDays * 24 * 60 * 60 * 1000; // 30 days in milliseconds

        set((state) => ({
          categories: state.categories.filter((cat) => {
            if (!cat.deletedAt) return true; // keep non-deleted categories
            const deletedAt = new Date(cat.deletedAt).getTime();
            return now - deletedAt < cutoff; // keep only items newer than cutoff
          }),
        }));
      },

      populateDummyData: () => {
        const now = new Date().toISOString();
        const dummyCategories: Category[] = [
          {
            id: nanoid(),
            name: 'Dairy Products',
            type: 'expense',
            color: '#FF6B6B',
            icon: 'shopping-bag',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'Fuel(CNG)',
            type: 'expense',
            color: '#4ECDC4',
            icon: 'battery',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'UBER',
            type: 'income',
            color: '#1DD1A1',
            icon: 'compass',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'OLA',
            type: 'income',
            color: '#54A0FF',
            icon: 'map-pin',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'Rapido',
            type: 'income',
            color: '#54A0FF',
            icon: 'map',
            createdAt: now,
            updatedAt: now,
          },
        ];
        set({ categories: dummyCategories });
      },
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate category store', error);
        } else if (state) {
          const retentionDays = useSettingsStore.getState().trashRetentionDays;
          state.purgeExpired(retentionDays);
        }
      },
    }
  )
);
