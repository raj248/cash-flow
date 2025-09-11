// ~/types/backup.ts
import type { Entry } from '~/store/entryStore';
import type { Category } from '~/store/categoryStore';

export type BackupData = {
  categories: Category[];
  entries: Entry[];
  exportedAt: string; // ISO timestamp
};
