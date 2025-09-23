// component date (from , to) picker

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateRangePickerProps {
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
}

export function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangePickerProps) {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  return (
    <View className="mb-4 flex-row justify-between">
      {/* From */}
      <TouchableOpacity
        className="rounded-lg bg-primary px-3 py-1"
        onPress={() => setShowFromPicker(true)}>
        <Text className="text-sm text-primary-foreground">
          From: {fromDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFromPicker(false);
            if (date) onFromDateChange(date);
          }}
        />
      )}

      {/* To */}
      <TouchableOpacity
        className="rounded-lg bg-primary px-3 py-1"
        onPress={() => setShowToPicker(true)}>
        <Text className="text-sm text-primary-foreground">To: {toDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showToPicker && (
        <DateTimePicker
          value={toDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowToPicker(false);
            if (date) onToDateChange(date);
          }}
        />
      )}
    </View>
  );
}
