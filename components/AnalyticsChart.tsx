import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CurveType, LineChart, LineChartPropsType, lineDataItem } from 'react-native-gifted-charts';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';

type Props = {
  initialFrom: Date;
  initialTo: Date;
};

export function AnalyticsChart({ initialFrom, initialTo }: Props) {
  const { entries } = useEntryStore();
  const { categories } = useCategoryStore();

  const chartData = useMemo(() => {
    const filtered = entries.filter((e) => {
      return (
        e.date >= initialFrom.toISOString().split('T')[0] &&
        e.date <= initialTo.toISOString().split('T')[0]
      );
    });

    // days in range
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
          return e.date === day && cat?.type === 'income';
        })
        .reduce((acc, e) => acc + e.amount, 0);

      return {
        value: total,
        label: new Date(day).getDate().toString(),
        dataPointColor: '#16a34a',
        dataPointRadius: 3,
        showDataPoint: true,
        // focusedDataPointLabelComponent: (props: { value: any }) => {
        //   return (
        //     <View
        //       style={{
        //         backgroundColor: 'red',
        //         padding: 4,
        //         borderRadius: 4,
        //         elevation: 2,
        //       }}>
        //       <Text style={{ fontSize: 10, color: 'black' }}>
        //         {props.value ? `₹${props.value}` : ''}
        //       </Text>
        //     </View>
        //   );
        // },
        // dataPointLabelComponent: (props: { value: any }) => {
        //   return (
        //     <View
        //       style={{
        //         backgroundColor: 'white',
        //         padding: 4,
        //         borderRadius: 4,
        //         elevation: 2,
        //       }}>
        //       <Text style={{ fontSize: 10, color: 'black' }}>
        //         {props.value ? `₹${props.value}` : ''}
        //       </Text>
        //     </View>
        //   );
        // },
      };
    });

    const expense: lineDataItem[] = days.map((day) => {
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
  }, [entries, categories, initialFrom, initialTo]);

  const totalIncome = chartData.income.reduce((acc, d) => acc + (d.value ?? 0), 0);
  const totalExpense = chartData.expense.reduce((acc, d) => acc + (d.value ?? 0), 0);

  return (
    <View>
      {/* Title */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-black dark:text-white">Income vs Expense</Text>
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
              ...chartData.expense.map((d) => d.value ?? 0),
              ...chartData.income.map((d) => d.value ?? 0)
            ) + 100
          }
          unFocusOnPressOut
          showDataPointLabelOnFocus
          showDataPointOnFocus
          showValuesAsDataPointsText
          showDataPointsForMissingValues
          interpolateMissingValues
          mostNegativeValue={-100}
          renderTooltip={(item: lineDataItem, index: number) => {
            return (
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 4,
                  borderRadius: 4,
                  elevation: 2,
                }}>
                <Text style={{ fontSize: 10, color: 'black' }}>
                  {item.value ? `₹${item.value}` : ''}
                </Text>
              </View>
            );
          }}
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
