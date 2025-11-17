import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { useSettingsStore } from '~/store/settingsStore';
import { BackupData } from '~/types/backup';

export const exportData = (): BackupData => {
  const categories = useCategoryStore.getState().categories;
  const entries = useEntryStore.getState().entries;
  const { trashRetentionDays, currencySymbol } = useSettingsStore.getState();

  return {
    categories,
    entries,
    settings: {
      trashRetentionDays,
      currencySymbol,
    },
    exportedAt: new Date().toISOString(),
  };
};

export const importData = (data: BackupData) => {
  const { setCategories } = useCategoryStore.getState();
  const { setEntries } = useEntryStore.getState();
  const { setTrashRetentionDays, setCurrencySymbol } = useSettingsStore.getState();

  setCategories(data.categories);
  setEntries(data.entries);

  if (data.settings) {
    setTrashRetentionDays(data.settings.trashRetentionDays);
    setCurrencySymbol(data.settings.currencySymbol);
  }
};
