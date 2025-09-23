import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CurveType, LineChart } from 'react-native-gifted-charts';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';

type Props = {
  initialFrom: Date;
  initialTo: Date;
};

export function AnalyticsCategory({ initialFrom, initialTo }: Props) {
  const { entries } = useEntryStore();
  const { categories } = useCategoryStore();

  const categoryData = useMemo(() => {
    const filteredEntries = entries.filter((e) => {
      const entryDate = new Date(e.date);
      return entryDate >= initialFrom && entryDate <= initialTo;
    });

    const data: {
      [categoryId: string]: { income: number; expense: number; name: string; color?: string };
    } = {};

    categories.forEach((cat) => {
      data[cat.id] = { income: 0, expense: 0, name: cat.name, color: cat.color };
    });

    filteredEntries.forEach((entry) => {
      const category = categories.find((c) => c.id === entry.categoryId);
      if (category) {
        if (category.type === 'income') {
          data[category.id].income += entry.amount;
        } else {
          data[category.id].expense += entry.amount;
        }
      }
    });

    return Object.values(data).filter((d) => d.income > 0 || d.expense > 0);
  }, [entries, categories, initialFrom, initialTo]);

  return (
    <View className="mt-8">
      <Text className="mb-4 text-xl font-bold text-black dark:text-white">Category Breakdown</Text>

      {/* Category List */}
      <View className="mt-4">
        {categoryData.length === 0 && (
          <Text className="text-center text-muted-foreground">No transactions in this period.</Text>
        )}
        {categoryData.map((cat, index) => (
          <View
            key={index}
            className="mb-3 flex-row items-center justify-between rounded-xl bg-card p-4 shadow">
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{cat.name}</Text>
              {cat.income > 0 && (
                <Text className="text-sm text-green-500">Income: ₹{cat.income}</Text>
              )}
              {cat.expense > 0 && (
                <Text className="text-sm text-red-500">Expense: ₹{cat.expense}</Text>
              )}
            </View>
            <Text className="text-lg font-bold text-foreground">₹{cat.income - cat.expense}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
