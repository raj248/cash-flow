// Analytics.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { CurveType, LineChart } from 'react-native-gifted-charts';
import { Button } from '../components/Button';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateRandomData = () => {
  const income = days.map((day) => ({
    value: Math.floor(Math.random() * 800) + 200,
    label: day,
    dataPointColor: '#16a34a', // green-600
    dataPointRadius: 3,
  }));

  const expense = days.map((day) => ({
    value: Math.floor(Math.random() * 600) + 100,
    label: day,
    dataPointColor: '#dc2626', // red-600
    dataPointRadius: 3,
  }));

  return { income, expense };
};

export default function Analytics() {
  const [chartData, setChartData] = useState(generateRandomData());

  const totalIncome = chartData.income.reduce((acc, curr) => acc + (curr.value ?? 0), 0);
  const totalExpense = chartData.expense.reduce((acc, curr) => acc + (curr.value ?? 0), 0);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerClassName="p-4">
        {/* Title */}
        <Text className="mb-4 text-xl font-bold text-black dark:text-white">
          Weekly Income vs Expense
        </Text>

        {/* Line Chart */}
        <View className="mb-6 items-center">
          <LineChart
            data={chartData.expense} // first line
            data2={chartData.income} // second line
            height={250}
            curved
            // curvature={0.2}
            curveType={CurveType.CUBIC}
            // areaChart
            thickness={2}
            color1="#dc2626" // expense (red)
            color2="#16a34a" // income (green)
            yAxisColor="#d1d5db"
            xAxisColor="#d1d5db"
            xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 12 }}
            yAxisTextStyle={{ color: '#6b7280', fontSize: 12 }}
            dataPointsColor1="#dc2626"
            dataPointsColor2="#16a34a"
            dataPointsRadius={1}
            initialSpacing={0}
            spacing={55}
            isAnimated
            animationDuration={1000}
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

        {/* Stats */}
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

        {/* Refresh Button */}
        <View className="mt-6">
          <Button title="Regenerate Data" onPress={() => setChartData(generateRandomData())} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
