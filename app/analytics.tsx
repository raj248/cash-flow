// Analytics.tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Button } from '../components/Button';

const generateRandomData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    value: Math.floor(Math.random() * 500) + 100,
    label: day,
    dataPointColor: '#2563eb', // blue-600
    dataPointRadius: 5,
  }));
};

export default function Analytics() {
  const [data, setData] = useState(generateRandomData());

  const total = data.reduce((acc, curr) => acc + (curr.value ?? 0), 0);
  const avg = (total / data.length).toFixed(1);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerClassName="p-4">
        {/* Title */}
        <Text className="mb-4 text-xl font-bold text-black dark:text-white">
          Weekly Expense Analytics
        </Text>

        {/* Line Chart */}
        <View className="mb-6 items-center">
          <LineChart
            data={data}
            height={200}
            curved
            thickness={2}
            extrapolateMissingValues
            color="#2563eb"
            yAxisColor="#d1d5db"
            xAxisColor="#d1d5db"
            xAxisLabelTextStyle={{ color: '#6b7280', fontSize: 12 }}
            yAxisTextStyle={{ color: '#6b7280', fontSize: 12 }}
            showDataPointLabelOnFocus
            dataPointsColor="#2563eb"
            dataPointsRadius={5}
            initialSpacing={0}
            spacing={50}
            isAnimated
            animationDuration={1200}
            areaChart
            startFillColor="#2563eb"
            endFillColor="#ffffff"
            startOpacity={0.3}
            endOpacity={0}
            showStripOnFocus
            showDataPointOnFocus
            showTextOnFocus
            focusEnabled
            stripColor="#2563eb55"
          />
        </View>

        {/* Stats */}
        <View className="mt-2 space-y-2">
          <Text className="text-sm text-black dark:text-white">Total Weekly Expense: ₹{total}</Text>
          <Text className="text-sm text-black dark:text-white">Average per Day: ₹{avg}</Text>
        </View>

        {/* Refresh Button */}
        <View className="mt-6">
          <Button title="Regenerate Data" onPress={() => setData(generateRandomData())} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
