import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, TextInput, Text, Card, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useEntryStore } from '~/store/entryStore';
import CategoryDropdownPicker from '~/components/RNDropdown';
import { useColorScheme } from '~/lib/useColorScheme';

export default function NewEntryPage() {
  const { colors } = useColorScheme();
  const addEntry = useEntryStore((s) => s.addEntry);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Track if the user has touched the fields
  const [touchedAmount, setTouchedAmount] = useState(false);
  const [touchedCategory, setTouchedCategory] = useState(false);

  const parsedAmount = parseFloat(amount);
  const amountError = touchedAmount && (!amount || isNaN(parsedAmount) || parsedAmount <= 0);
  const categoryError = touchedCategory && !categoryId;

  const handleSave = () => {
    // Mark fields as touched to trigger validation
    setTouchedAmount(true);
    setTouchedCategory(true);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0 || !categoryId) return;

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
    setTouchedAmount(false);
    setTouchedCategory(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
        {/* Amount Section */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Amount</Text>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={(val) => setAmount(val)}
              onBlur={() => setTouchedAmount(true)}
              keyboardType="numeric"
              mode="outlined"
              error={amountError}
            />
            <HelperText type="error" visible={amountError}>
              Amount must be a number greater than 0
            </HelperText>
          </Card.Content>
        </Card>

        {/* Category Section */}
        <Card mode="outlined">
          <Card.Content className="gap-2">
            <Text variant="labelLarge">Category</Text>
            <CategoryDropdownPicker
              categoryId={categoryId}
              setCategoryId={(val) => {
                setCategoryId(val);
                setTouchedCategory(true);
              }}
            />
            <HelperText type="error" visible={categoryError}>
              Please select a category
            </HelperText>
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
