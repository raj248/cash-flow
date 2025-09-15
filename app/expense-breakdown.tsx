// ExpenseBreakdown.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { PieChart, LineChart } from 'react-native-gifted-charts';
import { Button } from '../components/Button';

const categories = ['Food', 'Rent', 'Travel', 'Shopping', 'Bills'];

const randomNumber = () => Math.floor(Math.random() * 400) + 100;
function generateRandomColor(): string {
  const randomColor = Math.floor(Math.random() * 0xffffff);
  return `#${randomColor.toString(16).padStart(6, '0')}`;
}

const EXPENSE_DATA = () =>
  categories.map((cat) => ({
    value: randomNumber(),
    color: generateRandomColor(),
    text: cat,
  }));

export default function ExpenseBreakdown() {
  const [data, setData] = useState(EXPENSE_DATA());

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerClassName="p-4">
        {/* Title */}
        <Text className="mb-4 text-xl font-bold text-black dark:text-white">
          Expense Breakdown by Category
        </Text>

        {/* Pie Chart */}
        <View className="mb-6 items-center">
          <PieChart
            data={data}
            donut
            radius={130}
            innerRadius={85}
            // showText
            showValuesAsLabels
            // showGradient

            showTextBackground
            textBackgroundColor="#333"
            textBackgroundRadius={22}
            textColor="white"
            textSize={16}
            fontWeight="bold"
            strokeWidth={10}
            strokeColor="#333"
            innerCircleBorderWidth={10}
            innerCircleBorderColor="#333"
            gradientCenterColor="#ffffff20"
            isAnimated
            animationDuration={1200}
            focusOnPress
            toggleFocusOnPress
            showTooltip
            tooltipBackgroundColor="#000000cc"
            tooltipBorderRadius={8}
            tooltipTextNoOfLines={1}
            persistTooltip={false}
            centerLabelComponent={() => (
              <View className="items-center">
                <Text className="text-lg font-bold text-black dark:text-white">₹{total}</Text>
                <Text className="text-xs text-gray-500">Total</Text>
              </View>
            )}
          />
        </View>

        {/* Legend */}
        <View className="mt-2 space-y-2">
          {data.map((item, index) => {
            const percent = ((item.value / total) * 100).toFixed(1);
            return (
              <View key={index} className="flex-row items-center space-x-2">
                <View className="h-4 w-4 rounded" style={{ backgroundColor: item.color }} />
                <Text className="text-sm text-black dark:text-white">
                  {item.text} - ₹{item.value} ({percent}%)
                </Text>
              </View>
            );
          })}
        </View>

        {/* Shuffle Button */}
        <View className="mt-6">
          <Button title="Shuffle Expenses" onPress={() => setData(EXPENSE_DATA())} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
