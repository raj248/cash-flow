import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CurveType, LineChart } from 'react-native-gifted-charts';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';

type Props = {
  initialFrom?: Date;
  initialTo?: Date;
};

export function AnalyticsChart({ initialFrom, initialTo }: Props) {
  const { entries } = useEntryStore();
  const { categories } = useCategoryStore();

  const [fromDate, setFromDate] = useState<Date>(
    initialFrom ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [toDate, setToDate] = useState<Date>(initialTo ?? new Date());

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const chartData = useMemo(() => {
    const filtered = entries.filter((e) => {
      return (
        e.date >= fromDate.toISOString().split('T')[0] &&
        e.date <= toDate.toISOString().split('T')[0]
      );
    });

    // days in range
    const days: string[] = [];
    const cursor = new Date(fromDate);
    while (cursor <= toDate) {
      days.push(cursor.toISOString().split('T')[0]);
      cursor.setDate(cursor.getDate() + 1);
    }

    const income = days.map((day) => {
      const total = filtered
        .filter((e) => {
          const cat = categories.find((c) => c.id === e.categoryId);
          return e.date === day && cat?.type === 'income';
        })
        .reduce((acc, e) => acc + e.amount, 0);

      return {
        value: total,
        label: new Date(day).getDate().toString(),
        dataPointColor: '#16a34a',
        dataPointRadius: 3,
        showDataPoint: true,
      };
    });

    const expense = days.map((day) => {
      const total = filtered
        .filter((e) => {
          const cat = categories.find((c) => c.id === e.categoryId);
          return e.date === day && cat?.type === 'expense';
        })
        .reduce((acc, e) => acc + e.amount, 0);

      return {
        value: total,
        label: new Date(day).getDate().toString(),
        dataPointColor: '#dc2626',
        dataPointRadius: 3,
        showDataPoint: true,
      };
    });

    return { income, expense };
  }, [entries, categories, fromDate, toDate]);

  const totalIncome = chartData.income.reduce((acc, d) => acc + (d.value ?? 0), 0);
  const totalExpense = chartData.expense.reduce((acc, d) => acc + (d.value ?? 0), 0);

  return (
    <View>
      {/* Title */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-black dark:text-white">Income vs Expense</Text>
      </View>

      {/* Date pickers */}
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
              if (date) setFromDate(date);
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
              if (date) setToDate(date);
            }}
          />
        )}
      </View>

      {/* Chart */}
      <View className="mb-6 flex-1 items-center">
        <LineChart
          data={chartData.expense}
          data2={chartData.income}
          height={250}
          curved
          curveType={CurveType.CUBIC}
          thickness={2}
          color1="#dc2626"
          color2="#16a34a"
          yAxisColor="#d1d5db"
          xAxisColor="#d1d5db"
          xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 12 }}
          yAxisTextStyle={{ color: '#6b7280', fontSize: 12 }}
          dataPointsColor1="#dc2626"
          dataPointsColor2="#16a34a"
          dataPointsRadius={2}
          spacing={80}
          initialSpacing={10}
          rulesType="solid"
          //   isAnimated
          renderDataPointsAfterAnimationEnds
          animateOnDataChange
          animationDuration={800}
          focusEnabled
          showStripOnFocus
          showTextOnFocus
          stripColor="#9ca3af55"
          maxValue={
            Math.max(
              ...chartData.expense.map((d) => d.value),
              ...chartData.income.map((d) => d.value)
            ) + 100
          }
        />
      </View>

      {/* Totals */}
      <View className="mt-2 space-y-2">
        <Text className="text-sm text-black dark:text-white">Total Income: ₹{totalIncome}</Text>
        <Text className="text-sm text-black dark:text-white">Total Expense: ₹{totalExpense}</Text>
        <Text
          className={`text-sm font-semibold ${
            totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
          Net Balance: ₹{totalIncome - totalExpense}
        </Text>
      </View>
    </View>
  );
}
