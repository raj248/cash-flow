// ~/utils/exportImport.ts
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { BackupData } from '~/types/backup';

export const exportData = (): BackupData => {
  const categories = useCategoryStore.getState().categories;
  const entries = useEntryStore.getState().entries;

  return {
    categories,
    entries,
    exportedAt: new Date().toISOString(),
  };
};

// ~/utils/exportImport.ts
export const importData = (data: BackupData) => {
  const { setCategories } = useCategoryStore.getState();
  const { setEntries } = useEntryStore.getState();

  setCategories(data.categories);
  setEntries(data.entries);
};
