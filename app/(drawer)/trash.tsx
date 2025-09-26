// app/trash.tsx
import React, { useState } from 'react';
import { ScrollView, View, Alert, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { useColorScheme } from '~/lib/useColorScheme';
import { CategoryIcon } from '~/components/CategoryIcon';

import { Text, Dialog, Portal, Button, RadioButton } from 'react-native-paper';

export default function TrashPage() {
  const { colors } = useColorScheme();

  const { entries, restoreEntry, removeEntry, purgeTrash } = useEntryStore();
  const {
    categories,
    restoreCategory,
    removeCategory,
    purgeTrash: purgeCatTrash,
  } = useCategoryStore();

  const trashedEntries = entries.filter((e) => e.deletedAt);
  const trashedCategories = categories.filter((c) => c.deletedAt);

  // --- Dialog state ---
  const [catDialogVisible, setCatDialogVisible] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [catDeleteOption, setCatDeleteOption] = useState<'keep' | 'delete'>('keep');

  const [purgeDialogVisible, setPurgeDialogVisible] = useState(false);

  // --- Handlers ---
  const openDeleteCategoryDialog = (id: string) => {
    setSelectedCatId(id);
    setCatDeleteOption('keep');
    setCatDialogVisible(true);
  };

  const confirmDeleteCategory = () => {
    if (!selectedCatId) return;

    removeCategory(selectedCatId, false, (catId) =>
      useEntryStore.getState().removeEntriesByCategory(catId, catDeleteOption === 'delete')
    );
    setCatDialogVisible(false);
  };

  const confirmPurgeAll = () => {
    purgeTrash();
    purgeCatTrash();
    setPurgeDialogVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Purge All */}
      <TouchableOpacity
        onPress={() => setPurgeDialogVisible(true)}
        className="mb-4 rounded-xl bg-destructive px-4 py-3">
        <Text className="text-center font-semibold text-white">Purge All Trash</Text>
      </TouchableOpacity>

      {/* Categories */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Trashed Categories
      </Text>
      {trashedCategories.map((c) => (
        <View key={c.id} className="mb-3 flex-row items-center rounded-xl bg-card p-3 shadow">
          {c.iconImage ? (
            <Image source={{ uri: c.iconImage }} className="mr-3 h-10 w-10 rounded-full" />
          ) : c.icon ? (
            <Feather
              name={c.icon as any}
              size={24}
              color={c.type === 'income' ? 'green' : 'red'}
              style={{ marginRight: 12 }}
            />
          ) : null}

          <View className="flex-1">
            <Text className="font-semibold text-foreground">{c.name}</Text>
            <Text className="text-xs text-muted-foreground">
              {c.type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => restoreCategory(c.id)}
              className="bg-primary/20 rounded-lg px-3 py-1">
              <Text className="text-primary">Restore</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => openDeleteCategoryDialog(c.id)}
              className="bg-destructive/20 rounded-lg px-3 py-1">
              <Text className="text-destructive">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Entries */}
      <Text variant="titleMedium" style={{ marginVertical: 8 }}>
        Trashed Entries
      </Text>
      {trashedEntries.map((entry) => {
        const category = categories.find((cat) => cat.id === entry.categoryId);
        const isIncome = category?.type === 'income';

        return (
          <View key={entry.id} className="mb-3 flex-row items-center rounded-xl bg-card p-3 shadow">
            <CategoryIcon
              categoryId={category?.id ?? 'N/A'}
              size={30}
              color={category?.color || colors.primary}
            />

            <View className="ml-3 flex-1">
              <Text className="font-semibold text-foreground">
                {(category?.name || 'Category N/A') + (category?.deletedAt ? ' (Deleted)' : '') ||
                  'Category N/A'}
              </Text>
              <Text className="text-sm text-muted-foreground">{entry.note}</Text>
              <Text className="text-xs text-muted-foreground">
                {new Date(entry.date).toLocaleDateString()}
              </Text>
            </View>

            <Text className={`text-lg font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
              {isIncome ? '+' : '-'}₹{entry.amount}
            </Text>

            <View className="ml-3 flex-col gap-2">
              <TouchableOpacity
                onPress={() => restoreEntry(entry.id)}
                className="bg-primary/20 rounded-lg px-2 py-1">
                <Text className="text-xs text-primary">Restore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeEntry(entry.id, false)}
                className="bg-destructive/20 rounded-lg px-2 py-1">
                <Text className="text-xs text-destructive">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      {/* --- Category Delete Dialog --- */}
      <Portal>
        <Dialog visible={catDialogVisible} onDismiss={() => setCatDialogVisible(false)}>
          <Dialog.Title>Delete Category</Dialog.Title>
          <Dialog.Content>
            <Text>Do you want to delete all entries under this category or keep them?</Text>
            <RadioButton.Group
              onValueChange={(v) => setCatDeleteOption(v as 'keep' | 'delete')}
              value={catDeleteOption}>
              <RadioButton.Item label="Keep Entries" value="keep" />
              <RadioButton.Item label="Delete Entries" value="delete" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCatDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmDeleteCategory} mode="contained" textColor="white">
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* --- Purge All Dialog --- */}
        <Dialog visible={purgeDialogVisible} onDismiss={() => setPurgeDialogVisible(false)}>
          <Dialog.Title>Purge Trash</Dialog.Title>
          <Dialog.Content>
            <Text>This will permanently delete all trashed items.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button className="px-2" onPress={() => setPurgeDialogVisible(false)}>
              Cancel
            </Button>
            <Button
              className="bg-destructive px-2"
              onPress={confirmPurgeAll}
              mode="contained"
              textColor="white">
              Purge
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}
