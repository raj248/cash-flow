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
  removeCategory: (id: string) => void;
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

      removeCategory: (id) => {
        const categoryToRemove = get().categories.find((c) => c.id === id);

        if (categoryToRemove?.iconImage) {
          FileSystem.deleteAsync(categoryToRemove.iconImage, { idempotent: true }).catch((err) =>
            console.warn('Failed to delete icon image:', err)
          );
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
