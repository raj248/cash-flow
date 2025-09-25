// app/trash.tsx
import React from 'react';
import { ScrollView, View, Alert, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { useColorScheme } from '~/lib/useColorScheme';
import { CategoryIcon } from '~/components/CategoryIcon';

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

  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      'Delete Category',
      'Do you want to delete all entries under this category or keep them?',
      [
        {
          text: 'Keep Entries',
          onPress: () =>
            removeCategory(id, false, (catId: string) =>
              useEntryStore.getState().removeEntriesByCategory(catId, false)
            ),
        },
        {
          text: 'Delete Entries',
          style: 'destructive',
          onPress: () =>
            removeCategory(id, false, (catId) =>
              useEntryStore.getState().removeEntriesByCategory(catId, true)
            ),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePurgeAll = () => {
    Alert.alert('Purge Trash', 'This will permanently delete all trashed items.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Purge',
        style: 'destructive',
        onPress: () => {
          purgeTrash();
          purgeCatTrash();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Purge All */}
      <TouchableOpacity
        onPress={handlePurgeAll}
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
              onPress={() => handleDeleteCategory(c.id)}
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
    </ScrollView>
  );
}
