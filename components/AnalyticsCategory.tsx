import React, { useMemo } from 'react';
import { View, Text, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEntryStore } from '~/store/entryStore';
import { Category, useCategoryStore } from '~/store/categoryStore';

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
      [categoryId: string]: { income: number; expense: number; category: Category };
    } = {};

    categories.forEach((cat) => {
      data[cat.id] = { income: 0, expense: 0, category: cat };
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
      <View className="space-y-3">
        {categoryData.length === 0 && (
          <Text className="text-center text-gray-500 dark:text-gray-400">
            No transactions in this period.
          </Text>
        )}

        {categoryData.map(({ category, income, expense }, index) => {
          const net = income - expense;
          const isIncome = category.type === 'income';
          const accentColor = category.color ?? (isIncome ? '#22c55e' : '#ef4444');

          return (
            <View
              key={index}
              className="mb-4 flex-row items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
              {/* Icon */}
              <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${accentColor}20` }}>
                {category.iconImage ? (
                  <Image
                    source={{ uri: category.iconImage }}
                    className="h-6 w-6"
                    resizeMode="contain"
                  />
                ) : (
                  <Feather
                    name={(category.icon as any) ?? (isIncome ? 'arrow-down' : 'arrow-up')}
                    size={20}
                    color={accentColor}
                  />
                )}
              </View>

              {/* Category Info */}
              <View className="flex-1">
                <Text className="font-semibold text-foreground">{category.name}</Text>
                {income > 0 && <Text className="text-sm text-green-500">Income: ₹{income}</Text>}
                {expense > 0 && <Text className="text-sm text-red-500">Expense: ₹{expense}</Text>}
              </View>

              {/* Net */}
              <Text
                className={`ml-2 text-base font-bold ${
                  net >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {net >= 0 ? '+' : ''}₹{net}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
