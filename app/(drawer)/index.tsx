import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

export default function Home() {
  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <Text className="mb-4 text-center text-2xl font-bold">Cash Flow - Daily Khata</Text>

      {/* Net Balance Card */}
      <View className="mb-4 rounded-2xl bg-white p-4 shadow">
        <Text className="text-lg font-semibold text-gray-600">Net Balance</Text>
        <Text className="mt-2 text-3xl font-bold text-green-600">$600</Text>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-gray-500">Income: $1250</Text>
          <Text className="text-gray-500">Expense: $650</Text>
        </View>
      </View>

      {/* Income Section */}
      <View className="mb-4">
        <Text className="mb-2 text-lg font-bold">Income Sources</Text>
        <View className="flex-row flex-wrap justify-between">
          {['Salary', 'Tips', 'Rent', 'Other'].map((item, i) => (
            <View key={i} className="mb-3 w-[48%] rounded-xl bg-green-100 p-4 shadow">
              <Text className="font-semibold text-green-700">{item}</Text>
              <Text className="mt-1 text-lg font-bold text-green-800">$0</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Expenditure Section */}
      <View className="mb-4">
        <Text className="mb-2 text-lg font-bold">Expenditures</Text>
        <View className="flex-row flex-wrap justify-between">
          {['Fuel', 'Food'].map((item, i) => (
            <View key={i} className="mb-3 w-[48%] rounded-xl bg-red-100 p-4 shadow">
              <Text className="font-semibold text-red-700">{item}</Text>
              <Text className="mt-1 text-lg font-bold text-red-800">$0</Text>
            </View>
          ))}
          {/* Misc Card */}
          <TouchableOpacity className="w-full rounded-xl bg-blue-100 p-4 shadow">
            <Text className="font-semibold text-blue-700">+ Add Misc</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
