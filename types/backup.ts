// ~/types/backup.ts
import type { Entry } from '~/store/entryStore';
import type { Category } from '~/store/categoryStore';

export type BackupData = {
  categories: Category[];
  entries: Entry[];
  settings: {
    trashRetentionDays: number;
    currencySymbol: string;
  };
  exportedAt: string; // ISO timestamp
};
