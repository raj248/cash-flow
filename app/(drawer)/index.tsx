import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import React, { use, useState } from 'react';
import { Portal } from 'react-native-paper';
import FloatingButton from '~/components/FloatingButton';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { Feather } from '@expo/vector-icons';
import { CategoryIcon } from '~/components/CategoryIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useColorScheme } from '~/lib/useColorScheme';
export default function Home() {
  const { entries } = useEntryStore();
  const { categories } = useCategoryStore();
  const [atEnd, setAtEnd] = useState(false);
  const todayEntry = useEntryStore.getState().getTodayEntries();

  const { showActionSheetWithOptions } = useActionSheet();
  const { colorScheme, colors } = useColorScheme();
  // Detect end of scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20; // threshold before considering "end"
    const isEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    setAtEnd(isEnd);
  };

  // Calculate totals
  const incomeTotal = todayEntry
    .filter((e) => {
      const cat = categories.find((c) => c.id === e.categoryId);
      return cat?.type === 'income';
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const expenseTotal = todayEntry
    .filter((e) => {
      const cat = categories.find((c) => c.id === e.categoryId);
      return cat?.type === 'expense';
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = incomeTotal - expenseTotal;

  // Group entries by category
  const groupedByCategory = categories.map((cat) => {
    const catEntries = todayEntry.filter((e) => e.categoryId === cat.id);
    const total = catEntries.reduce((sum, e) => sum + e.amount, 0);
    return { ...cat, total };
  });

  const incomeCategories = groupedByCategory.filter((c) => c.type === 'income');
  const expenseCategories = groupedByCategory.filter((c) => c.type === 'expense');

  const renderCategoryIcon = (cat: (typeof groupedByCategory)[number]) => {
    if (cat.iconImage) {
      return (
        <Image
          source={{ uri: cat.iconImage }}
          className="mr-2 h-12 w-12 rounded"
          resizeMode="contain"
        />
      );
    } else if (cat.icon) {
      return (
        <Feather
          name={cat.icon as any}
          size={20}
          color={cat.color ?? 'black'}
          style={{ marginRight: 15 }}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView className="flex-1" edges={['bottom', 'left', 'right']}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 bg-gray-100 p-4">
        {/* Header */}
        <Text className="mb-4 text-center text-2xl font-bold">Cash Flow - Daily Khata</Text>

        {/* Net Balance Card */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow">
          <Text className="text-lg font-semibold text-gray-600">Net Balance</Text>
          <Text
            className={`mt-2 text-3xl font-bold ${
              netBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
            ₹{netBalance}
          </Text>
          <View className="mt-2 flex-row justify-between">
            <Text className="text-gray-500">Income: ₹{incomeTotal}</Text>
            <Text className="text-gray-500">Expense: ₹{expenseTotal}</Text>
          </View>
        </View>

        {/* Income Section */}
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold">Income Sources</Text>
          <View className="flex-row flex-wrap justify-between">
            {incomeCategories.map((cat) => (
              <View
                key={cat.id}
                className="mb-3 w-[48%] flex-row items-center rounded-xl bg-green-100 p-4 shadow">
                {renderCategoryIcon(cat)}
                <View>
                  <Text className="font-semibold text-green-700">{cat.name}</Text>
                  <Text className="mt-1 text-lg font-bold text-green-800">₹{cat.total}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Expenditure Section */}
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold">Expenditures</Text>
          <View className="flex-row flex-wrap justify-between">
            {expenseCategories.map((cat) => (
              <View
                key={cat.id}
                className="mb-3 w-[48%] flex-row items-center rounded-xl bg-red-100 p-4 shadow">
                {renderCategoryIcon(cat)}
                <View>
                  <Text className="font-semibold text-red-700">{cat.name}</Text>
                  <Text className="mt-1 text-lg font-bold text-red-800">₹{cat.total}</Text>
                </View>
              </View>
            ))}

            {/* Misc Card */}
            <TouchableOpacity className="w-full rounded-xl bg-blue-100 p-4 shadow">
              <Text className="font-semibold text-blue-700">+ Add Misc</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List of all entries in a flatlist */}
        <Text className="mb-2 text-lg font-bold">All Entries</Text>
        {todayEntry.length === 0 && <Text className="text-gray-500">No entries added yet.</Text>}
        {/* {entries.length === 0 && <Text className="text-gray-500">No entries added yet.</Text>} */}
        {todayEntry //entries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((entry, index) => {
            const category = categories.find((cat) => cat.id === entry.categoryId);
            const isIncome = category?.type === 'income';
            return (
              <Pressable
                key={entry.id || index}
                className="mb-2 flex-row items-center gap-3 rounded-xl bg-white p-3 shadow"
                onPress={async () => {
                  const options = ['Delete', 'Edit', 'Cancel'];
                  const destructiveButtonIndex = 0;
                  const cancelButtonIndex = 2;

                  showActionSheetWithOptions(
                    {
                      options,
                      cancelButtonIndex,
                      destructiveButtonIndex,
                      title: entry.amount.toString(),
                      message: 'Description',
                      containerStyle: {
                        backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
                      },
                      textStyle: {
                        color: colors.foreground,
                      },
                    },
                    (selectedIndex) => {
                      switch (selectedIndex) {
                        case 1:
                          // Edit
                          alert('This feature is not yet implemented.');
                          break;

                        case destructiveButtonIndex:
                          // Delete
                          useEntryStore.getState().removeEntry(entry.id);
                          break;

                        case cancelButtonIndex:
                        // Canceled
                      }
                    }
                  );
                }}>
                {category?.id && (
                  <CategoryIcon
                    categoryId={category.id}
                    size={30}
                    color={category?.color || 'black'}
                  />
                )}
                <View className="flex-1">
                  <Text className="font-semibold">{category?.name || 'N/A'}</Text>
                  <Text className="text-sm text-gray-500">{entry.note}</Text>
                  <Text className="text-xs text-gray-400">
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncome ? '+' : '-'}₹{entry.amount}
                </Text>
              </Pressable>
            );
          })}
      </ScrollView>

      <Portal>
        <FloatingButton visible={!atEnd || todayEntry.length === 0} />
      </Portal>
    </SafeAreaView>
  );
}
