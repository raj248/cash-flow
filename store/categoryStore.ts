// store/categoryStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { create } from 'zustand';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid/non-secure';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  removeCategory: (id: string, soft?: boolean) => void; // <-- soft flag
  getCategoryIcon: (id: string) => { icon?: string; iconImage?: string; color?: string } | null;
  setCategories: (cats: Category[]) => void;
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

      removeCategory: (id, soft = true) => {
        const categoryToRemove = get().categories.find((c) => c.id === id);

        if (!categoryToRemove) return;

        if (!soft && categoryToRemove.iconImage) {
          FileSystem.deleteAsync(categoryToRemove.iconImage, { idempotent: true }).catch((err) =>
            console.warn('Failed to delete icon image:', err)
          );
          console.log('Deleted icon image:', categoryToRemove.iconImage);
        }

        set((state) => ({
          categories: state.categories
            .map((c) =>
              c.id === id
                ? soft
                  ? { ...c, deletedAt: new Date().toISOString() }
                  : c // hard delete handled by filtering below
                : c
            )
            .filter((c) => !c.deletedAt || !soft), // remove if hard delete
        }));
      },

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
    }
  )
);
