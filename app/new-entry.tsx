// app/add-entry.tsx
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import CategoryDropdownPicker from '~/components/RNDropdown';
import { useColorScheme } from '~/lib/useColorScheme';

export default function NewEntryPage() {
  const { colors } = useColorScheme();
  const addEntry = useEntryStore((s) => s.addEntry);
  const categories = useCategoryStore((s) => s.categories);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // validate amount
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    if (!categoryId) {
      alert('Please select a category');
      return;
    }

    addEntry({
      amount: parsedAmount,
      categoryId,
      date: date.toISOString().split('T')[0],
      note,
    });

    // reset form
    setAmount('');
    setNote('');
    setCategoryId(undefined);
    setDate(new Date());
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
        {/* Amount Section */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Amount</Text>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Category Section */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Category</Text>
            <CategoryDropdownPicker categoryId={categoryId} setCategoryId={setCategoryId} />
          </Card.Content>
        </Card>

        {/* Date Section */}
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

        {/* Note Section */}
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

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          className="mt-4"
          style={{ borderRadius: 8, paddingVertical: 6 }}>
          Save Entry
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
