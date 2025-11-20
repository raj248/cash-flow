import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { Entry } from '~/store/entryStore'; // Assuming Category is also exported from entryStore or a shared types file
import { Category } from '~/store/categoryStore';

// 2. New Entry Dialog Component (Reusable)
type NewEntryDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  categories: Category[];
  addEntry: (entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
};

// This uses standard RN Modal and components to replace react-native-paper Dialog.
export default function NewEntryDialog({
  visible,
  onDismiss,
  categories,
  addEntry,
}: NewEntryDialogProps) {
  const { colors } = useColorScheme();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Filter categories inside the component for clean dependency
  const activeCategories = useMemo(() => categories.filter((c) => !c.deletedAt), [categories]);

  // Determine the type (income/expense) of the currently selected category
  const selectedCategoryType = useMemo(() => {
    return activeCategories.find((c) => c.id === selectedCategoryId)?.type;
  }, [selectedCategoryId, activeCategories]);

  const handleSave = () => {
    let parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0 || !selectedCategoryId) {
      console.error('Invalid amount or category missing');
      return;
    }

    parsedAmount = Math.abs(parsedAmount);

    const newEntry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
      categoryId: selectedCategoryId,
      amount: parsedAmount,
      date: new Date().toISOString(),
      note: note.trim() || undefined,
      userId: 'local-user',
    };

    addEntry(newEntry);
    // Reset state and dismiss
    setAmount('');
    setNote('');
    setSelectedCategoryId(null);
    onDismiss();
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const isSelected = item.id === selectedCategoryId;

    const iconBgColor = isSelected ? colors.primary : colors.grey;
    const iconColor = isSelected ? colors.foreground : colors.grey;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => setSelectedCategoryId(item.id)}
        className={`mx-1 items-center rounded-xl border p-2 ${isSelected ? 'border-primary shadow-sm' : 'shadow-xs border-border bg-card'}`}
        style={{ width: 85 }}>
        <View
          className={`mb-1 h-12 w-12 items-center justify-center rounded-full`}
          style={{ backgroundColor: iconBgColor }}>
          {/* Using simple text/emoji for icons */}
          <Text className={`text-2xl font-bold`} style={{ color: iconColor }}>
            {item.icon || item.name[0]}
          </Text>
        </View>
        <Text
          className={`w-full text-center text-xs ${isSelected ? 'font-semibold text-primary' : 'text-foreground'}`}
          numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const isSaveDisabled = !selectedCategoryId || parseFloat(amount) <= 0;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onDismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end">
        <Pressable onPress={onDismiss} className="absolute inset-0 bg-black/50" />

        <View className="rounded-t-2xl bg-card p-4 shadow-xl">
          <Text
            style={{ color: colors.foreground }}
            className="mb-4 border-b border-border pb-3 text-xl font-bold">
            New Transaction
          </Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Amount Input */}
            <Text className="mb-1 mt-2 text-sm font-medium text-muted-foreground">Amount</Text>
            <TextInput
              className="bg-input/20 h-12 rounded-lg border border-input p-3 text-2xl font-extrabold text-foreground"
              placeholder="0.00"
              placeholderTextColor={colors.grey}
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
            />

            {/* Description Input */}
            <Text className="mb-1 mt-4 text-sm font-medium text-muted-foreground">
              Description (Optional)
            </Text>
            <TextInput
              className="bg-input/20 h-10 rounded-lg border border-input p-2 text-base text-foreground"
              placeholder="e.g., Coffee at Starbucks"
              placeholderTextColor={colors.grey}
              value={note}
              onChangeText={setNote}
            />

            {/* Category Selector */}
            <Text className="mb-2 mt-4 text-sm font-medium text-muted-foreground">
              Select Category ({selectedCategoryType ? selectedCategoryType.toUpperCase() : 'N/A'})
            </Text>
            <FlatList
              data={activeCategories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 5 }}
            />
          </ScrollView>

          {/* Actions */}
          <View className="mt-4 flex-row justify-end border-t border-border pt-4">
            <TouchableOpacity onPress={onDismiss} className="mr-2 rounded-lg px-4 py-2">
              <Text style={{ color: colors.grey }} className="font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaveDisabled}
              className={`rounded-lg px-4 py-2 ${isSaveDisabled ? 'bg-muted' : 'bg-primary'}`}>
              <Text
                style={{ color: isSaveDisabled ? colors.grey : colors.foreground }}
                className="font-semibold">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
