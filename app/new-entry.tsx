// app/add-entry.tsx
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

import { Picker, PickerItem } from '~/components/nativewindui/Picker';
import { useColorScheme } from '~/lib/useColorScheme';
import { router } from 'expo-router';
import CategoryDropdown from '~/components/CategoryDropdown';
import CategoryDropdownPicker from '~/components/RNDropdown';

export default function NewEntryPage() {
  const { colors } = useColorScheme();
  const addEntry = useEntryStore((s) => s.addEntry);
  const categories = useCategoryStore((s) => s.categories);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showDropDown, setShowDropDown] = useState(false);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const handleSave = () => {
    if (!amount || !categoryId) {
      alert('Please enter amount and select a category');
      return;
    }

    addEntry({
      amount: parseFloat(amount),
      categoryId,
      date: date.toISOString().split('T')[0],
      note,
    });

    setAmount('');
    setNote('');
    setCategoryId(undefined);
    setDate(new Date());
    // alert('Entry added!');
    router.back();
  };

  return (
    <ScrollView className="flex-1 gap-3 p-4">
      <Text variant="titleLarge" className="mb-4">
        Add New Entry
      </Text>

      {/* Amount */}
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        mode="outlined"
        // className="mb-2 pb-4"
        style={{ marginBottom: 10 }}
      />

      {/* Category
      <Dropdown
        placeholder="Select Category"
        mode="outlined"
        menuDownIcon={() => <Feather name="chevron-down" size={20} />}
        menuUpIcon={() => <Feather name="chevron-up" size={20} />}
        CustomMenuHeader={() => (
          <View>
            <Text variant="titleSmall" className="p-2">
              Select Category
            </Text>
          </View>
        )}
        value={categoryId ?? 'Select Category'}
        onSelect={(s) => {
          if (s) setCategoryId(s);
          setShowDropDown(false);
        }}
        // CustomDropdownItem={({ item })}
        options={categoryOptions}
      /> */}
      {/* 
      <CategoryDropdown
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        setShowDropDown={setShowDropDown}
      /> */}

      <CategoryDropdownPicker categoryId={categoryId} setCategoryId={setCategoryId} />

      {/* Date */}
      <Button mode="outlined" className="my-3" onPress={() => setShowDatePicker(true)}>
        {date.toDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          placeholderText="Select Date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Note */}
      <TextInput
        placeholder="Note (optional)"
        value={note}
        onChangeText={setNote}
        mode="outlined"
        // className="mb-3"
        style={{ marginBottom: 10 }}
      />

      {/* Save */}
      <Button mode="contained" onPress={handleSave}>
        Save Entry
      </Button>
    </ScrollView>
  );
}
