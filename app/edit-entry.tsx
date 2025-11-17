import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Button, TextInput, Text, Card, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import CategoryDropdownPicker from '~/components/RNDropdown';
import { useColorScheme } from '~/lib/useColorScheme';

export default function EditEntryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useColorScheme();
  const updateEntry = useEntryStore((s) => s.updateEntry);
  const entries = useEntryStore((s) => s.entries);
  const categories = useCategoryStore((s) => s.categories);

  const entry = entries.find((e) => e.id === id);

  // local states
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // error states
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // pre-fill on mount
  useEffect(() => {
    if (entry) {
      setAmount(entry.amount.toString());
      setCategoryId(entry.categoryId ?? undefined);
      setNote(entry.note || '');
      setDate(new Date(entry.date));
    }
  }, [entry]);

  const handleSave = () => {
    let hasError = false;
    setAmountError('');
    setCategoryError('');

    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Please enter a valid amount greater than 0');
      hasError = true;
    }

    if (!categoryId) {
      setCategoryError('Please select a category');
      hasError = true;
    }

    if (hasError) return;

    updateEntry(entry!.id, {
      amount: parsedAmount,
      categoryId,
      date: date.toISOString(),
      note,
    });

    router.back();
  };

  if (!entry) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Entry not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
        {/* Amount */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Amount</Text>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              mode="outlined"
              error={!!amountError}
            />
            <HelperText type="error" visible={!!amountError}>
              {amountError}
            </HelperText>
          </Card.Content>
        </Card>

        {/* Category */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Category</Text>
            <CategoryDropdownPicker categoryId={categoryId} setCategoryId={setCategoryId} />
            <HelperText type="error" visible={!!categoryError}>
              {categoryError}
            </HelperText>
          </Card.Content>
        </Card>

        {/* Date */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Date</Text>
            <Button
              mode="outlined"
              icon={() => <Feather name="calendar" size={18} color={colors.primary} />}
              onPress={() => setShowDatePicker(true)}>
              {date.toDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </Card.Content>
        </Card>

        {/* Note */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Note (optional)</Text>
            <TextInput
              placeholder="Add a note..."
              value={note}
              onChangeText={setNote}
              mode="outlined"
              multiline
            />
          </Card.Content>
        </Card>

        {/* Save */}
        <Button
          mode="contained"
          onPress={handleSave}
          className="mt-4"
          style={{ borderRadius: 8, paddingVertical: 6 }}>
          Update Entry
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
