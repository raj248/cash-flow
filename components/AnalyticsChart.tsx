import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { CurveType, LineChart, lineDataItem } from 'react-native-gifted-charts';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { useSettingsStore } from '~/store/settingsStore';

type Props = {
  initialFrom: Date;
  initialTo: Date;
};

export function AnalyticsChart({ initialFrom, initialTo }: Props) {
  const { entries } = useEntryStore();
  const { categories } = useCategoryStore();
  const { currencySymbol } = useSettingsStore();

  const chartData = useMemo(() => {
    const filtered = entries.filter(
      (e) =>
        e.date.split('T')[0] >= initialFrom.toISOString().split('T')[0] &&
        e.date.split('T')[0] <= initialTo.toISOString().split('T')[0]
    );
    console.log('Filetered entry length: ', filtered.length);
    // Build full day range
    const days: string[] = [];
    const cursor = new Date(initialFrom);
    while (cursor <= initialTo) {
      days.push(cursor.toISOString().split('T')[0]);
      cursor.setDate(cursor.getDate() + 1);
    }

    const income: lineDataItem[] = days.map((day) => {
      const total = filtered
        .filter((e) => {
          const cat = categories.find((c) => c.id === e.categoryId);
          return e.date.split('T')[0] === day && cat?.type === 'income';
        })
        .reduce((acc, e) => acc + e.amount, 0);

      return {
        value: total,
        label: new Date(day).getDate().toString(),
        dataPointColor: '#16a34a',
        dataPointRadius: total > 0 ? 4 : 0,
      };
    });

    const expense: lineDataItem[] = days.map((day) => {
      const total = filtered
        .filter((e) => {
          const cat = categories.find((c) => c.id === e.categoryId);
          return e.date.split('T')[0] === day && cat?.type === 'expense';
        })
        .reduce((acc, e) => acc + e.amount, 0);

      return {
        value: total,
        label: new Date(day).getDate().toString(),
        dataPointColor: '#dc2626',
        dataPointRadius: total > 0 ? 4 : 0,
      };
    });

    return { income, expense };
  }, [entries, categories, initialFrom, initialTo]);

  const totalIncome = chartData.income.reduce((acc, d) => acc + (d.value ?? 0), 0);
  const totalExpense = chartData.expense.reduce((acc, d) => acc + (d.value ?? 0), 0);

  return (
    <View>
      {/* Title */}
      <View className="mb-4">
        <Text className="text-xl font-semibold text-black dark:text-white">Income vs Expense</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          Overview of your selected date range
        </Text>
      </View>

      {/* Chart */}
      <View className="mb-6 items-center">
        <LineChart
          key={`${initialFrom.toISOString()}-${initialTo.toISOString()}`} // 👈 force re-render
          data={chartData.expense}
          data2={chartData.income}
          height={220}
          curved
          curveType={CurveType.CUBIC}
          thickness={2.5}
          color1="#ef4444" // softer red
          color2="#22c55e" // softer green
          yAxisColor="transparent"
          xAxisColor="transparent"
          xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 11 }}
          yAxisTextStyle={{ color: '#6b7280', fontSize: 11 }}
          initialSpacing={10}
          rulesType="dotted"
          rulesColor="#e5e7eb" // subtle grid
          areaChart
          startFillColor1="#ef444420"
          startFillColor2="#22c55e20"
          endFillColor1="#ef444400"
          endFillColor2="#22c55e00"
          startOpacity={0.3}
          endOpacity={0.05}
          isAnimated
          animationDuration={600}
          showDataPointOnFocus
          showStripOnFocus
          stripColor="#9ca3af55"
          // spacing={40}
          spacing={Math.max(40, 300 / chartData.expense.length)}
          renderTooltip={(item: lineDataItem) => (
            <View
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#111' }}>
                {currencySymbol}
                {item.value}
              </Text>
            </View>
          )}
          maxValue={
            Math.max(
              ...chartData.expense.map((d) => d.value ?? 0),
              ...chartData.income.map((d) => d.value ?? 0)
            ) + 100
          }
        />
      </View>

      {/* Totals */}
      <View className="mt-2 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          Total Income:{' '}
          <Text className="font-semibold text-green-600">
            {currencySymbol}
            {totalIncome}
          </Text>
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          Total Expense:{' '}
          <Text className="font-semibold text-red-600">
            {currencySymbol}
            {totalExpense}
          </Text>
        </Text>
        <Text
          className={`mt-1 text-base font-bold ${
            totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
          Net Balance: {currencySymbol}
          {totalIncome - totalExpense}
        </Text>
      </View>
    </View>
  );
}
