// app/trash.tsx
import React from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Button, Card, Text, IconButton } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';

export default function TrashPage() {
  const { entries, restoreEntry, removeEntry, purgeTrash } = useEntryStore();
  const {
    categories,
    restoreCategory,
    removeCategory: removeCat,
    purgeTrash: purgeCatTrash,
  } = useCategoryStore();

  const trashedEntries = entries.filter((e) => e.deletedAt);
  const trashedCategories = categories.filter((c) => c.deletedAt);

  // removeEntriesByCategory only soft deletes the entry
  const handleDeleteCategory = (id: string) => {
    Alert.alert(
      'Delete Category',
      'Do you want to delete all entries under this category or keep them?',
      [
        {
          text: 'Keep Entries',
          onPress: () =>
            removeCat(id, false, (catId: string) =>
              useEntryStore.getState().removeEntriesByCategory(catId, false)
            ),
        },
        {
          text: 'Delete Entries',
          style: 'destructive',
          onPress: () =>
            removeCat(id, false, (catId) =>
              useEntryStore.getState().removeEntriesByCategory(catId, true)
            ),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePurgeAll = () => {
    Alert.alert('Purge Trash', 'This will permanently delete all trashed entries and categories.', [
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
      <Button mode="contained" style={{ marginBottom: 16 }} onPress={handlePurgeAll}>
        Purge All Trash
      </Button>

      {/* Categories */}
      <Text variant="titleMedium">Trashed Categories</Text>
      {trashedCategories.map((cat) => (
        <Card key={cat.id} mode="outlined">
          <Card.Content
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>{cat.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="rotate-ccw" onPress={() => restoreCategory(cat.id)} />
              <IconButton icon="trash" onPress={() => handleDeleteCategory(cat.id)} />
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Entries */}
      <Text variant="titleMedium" style={{ marginTop: 16 }}>
        Trashed Entries
      </Text>
      {trashedEntries.map((entry) => (
        <Card key={entry.id} mode="outlined">
          <Card.Content
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>{entry.note || `₹${entry.amount}`}</Text>
            <View style={{ flexDirection: 'row' }}>
              <IconButton icon="rotate-ccw" onPress={() => restoreEntry(entry.id)} />
              <IconButton icon="trash" onPress={() => removeEntry(entry.id, false)} />
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
