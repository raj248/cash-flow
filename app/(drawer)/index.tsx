import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Portal } from 'react-native-paper';
import FloatingButton from '~/components/FloatingButton';
import { useEntryStore } from '~/store/entryStore';
import { useCategoryStore } from '~/store/categoryStore';
import { Feather } from '@expo/vector-icons';
import { CategoryIcon } from '~/components/CategoryIcon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useColorScheme } from '~/lib/useColorScheme';
import DateTimePicker from '@react-native-community/datetimepicker'; // 👈 install this
import { cn } from '~/lib/cn';

export default function Home() {
  const { getEntriesByDate, removeEntry } = useEntryStore();
  const { categories } = useCategoryStore();
  const [atEnd, setAtEnd] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();
  const { colorScheme, colors, isDarkColorScheme } = useColorScheme();

  // Filtered entries by selectedDate
  const formattedDate = selectedDate.toISOString().split('T')[0];
  const dayEntries = getEntriesByDate(formattedDate);

  // filter undeleted categories
  const activeCategories = categories.filter((c) => !c.deletedAt);

  // Totals
  const incomeTotal = dayEntries
    .filter((e) => activeCategories.find((c) => c.id === e.categoryId)?.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const expenseTotal = dayEntries
    .filter((e) => activeCategories.find((c) => c.id === e.categoryId)?.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = incomeTotal - expenseTotal;

  // Category grouping
  const groupedByCategory = activeCategories.map((cat) => {
    const catEntries = dayEntries.filter((e) => e.categoryId === cat.id);
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

  // Scroll detection
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    setAtEnd(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 bg-background p-4">
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowPicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}

        {/* Net Balance Card with Date */}
        <View className="mb-4 rounded-2xl bg-card p-4 shadow">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-muted-foreground">Net Balance</Text>
            <TouchableOpacity
              className="rounded-lg bg-primary px-3 py-1"
              onPress={() => setShowPicker(true)}>
              <Text className="text-sm text-primary-foreground">
                {selectedDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            className={`mt-1 text-3xl font-bold ${
              netBalance >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
            ₹{netBalance}
          </Text>
          <View className="mt-2 flex-row justify-between">
            <Text className="text-muted-foreground">Income: ₹{incomeTotal}</Text>
            <Text className="text-muted-foreground">Expense: ₹{expenseTotal}</Text>
          </View>
        </View>

        {/* Income Section */}
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold text-foreground">Income Sources</Text>
          <View className="flex-row flex-wrap justify-between">
            {incomeCategories.map((cat) => (
              <View
                key={cat.id}
                className="mb-3 w-[48%] flex-row items-center rounded-xl bg-green-100 p-4 shadow dark:bg-green-900">
                {renderCategoryIcon(cat)}
                <View>
                  <Text className="font-semibold text-green-700 dark:text-green-300">
                    {cat.name}
                  </Text>
                  <Text className="mt-1 text-lg font-bold text-green-800 dark:text-green-200">
                    ₹{cat.total}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Expense Section */}
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold text-foreground">Expenditures</Text>
          <View className="flex-row flex-wrap justify-between">
            {expenseCategories.map((cat) => (
              <View
                key={cat.id}
                className="mb-3 w-[48%] flex-row items-center rounded-xl bg-red-100 p-4 shadow dark:bg-red-900">
                {renderCategoryIcon(cat)}
                <View>
                  <Text className="font-semibold text-red-700 dark:text-red-300">{cat.name}</Text>
                  <Text className="mt-1 text-lg font-bold text-red-800 dark:text-red-200">
                    ₹{cat.total}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* All Entries */}
        <Text className="mb-2 text-lg font-bold text-foreground">Entries</Text>
        {dayEntries.length === 0 && (
          <Text className="text-muted-foreground">No entries for this date.</Text>
        )}

        {dayEntries
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((entry) => {
            const category = categories.find((cat) => cat.id === entry.categoryId);
            const isIncome = category?.type === 'income';
            return (
              <Pressable
                key={entry.id}
                className="mb-2 flex-row items-center gap-3 rounded-xl bg-card p-3 shadow"
                onPress={() => {
                  showActionSheetWithOptions(
                    {
                      options: ['Edit', 'Delete', 'Cancel'],
                      cancelButtonIndex: 2,
                      destructiveButtonIndex: 1,
                      containerStyle: {
                        backgroundColor: isDarkColorScheme ? colors.card : colors.background,
                      },
                      textStyle: {
                        color: colors.foreground,
                      },
                    },
                    (selectedIndex) => {
                      switch (selectedIndex) {
                        case 0:
                          // Edit
                          Alert.alert(
                            'Not Implemented Yet',
                            'This feature is not implemented yet.',
                            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                          );
                          break;
                        case 1:
                          // Delete
                          removeEntry(entry.id);
                          break;
                        case 2:
                        // Cancel
                      }
                    }
                  );
                }}>
                <CategoryIcon
                  categoryId={category?.id ?? 'N/A'}
                  size={30}
                  color={category?.color || 'black'}
                />

                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {(category?.name || 'Category N/A') +
                      (category?.deletedAt ? ' (Deleted)' : '') || 'Category N/A'}
                  </Text>
                  <Text className="text-sm text-muted-foreground">{entry.note}</Text>
                  <Text className="text-xs text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  className={`text-lg font-bold ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                  {isIncome ? '+' : '-'}₹{entry.amount}
                </Text>
              </Pressable>
            );
          })}
      </ScrollView>

      <Portal>
        <FloatingButton visible={!atEnd || dayEntries.length === 0} />
      </Portal>
    </SafeAreaView>
  );
}
