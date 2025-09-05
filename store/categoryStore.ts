// store/categoryStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Category = {
  income: boolean; // true = income, false = expenditure
  icon?: string; // Feather icon name
  iconImage?: string; // local file path to custom image
  name: string;
};

type CategoryState = {
  categories: Category[];
  addCategory: (category: Category) => void;
  removeCategory: (name: string) => void;
};

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      removeCategory: (name) => {
        // remove image from file
        const categoryToRemove = get().categories.find((c) => c.name === name);
        if (categoryToRemove?.iconImage) {
          // You might want to add actual file system removal logic here if needed
          FileSystem.deleteAsync(categoryToRemove.iconImage);
          console.log('Would remove image:', categoryToRemove.iconImage);
        }

        set((state) => ({
          categories: state.categories.filter((c) => c.name !== name),
        }));
      },
    }),
    {
      name: 'category-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
