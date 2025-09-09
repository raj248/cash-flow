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
  populateDummyData: () => void;
  getCategoryIcon: (id: string) => { icon?: string; iconImage?: string; color?: string } | null;
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

      getCategoryIcon: (id) => {
        const category = get().categories.find((c) => c.id === id);
        if (!category) return null;

        return {
          icon: category.icon,
          iconImage: category.iconImage,
          color: category.color,
        };
      },

      populateDummyData: () => {
        const now = new Date().toISOString();
        const dummyCategories: Category[] = [
          {
            id: nanoid(),
            name: 'Food',
            type: 'expense',
            color: '#FF6B6B',
            icon: 'shopping-bag',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'Transport',
            type: 'expense',
            color: '#4ECDC4',
            icon: 'truck',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'Salary',
            type: 'income',
            color: '#1DD1A1',
            icon: 'dollar-sign',
            createdAt: now,
            updatedAt: now,
          },
          {
            id: nanoid(),
            name: 'Freelance',
            type: 'income',
            color: '#54A0FF',
            icon: 'briefcase',
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
