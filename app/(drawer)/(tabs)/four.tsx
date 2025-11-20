import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Pressable,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet, // Required for absoluteFillObject
} from 'react-native';
// Reanimated imports for the collapsing header effect
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';

// Existing external dependencies (assuming these imports resolve correctly in your environment)
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { router } from 'expo-router';
import { Portal, Dialog, Button as PaperButton } from 'react-native-paper';
import FloatingButton from '~/components/FloatingButton';
import { useEntryStore, Entry } from '~/store/entryStore';
import { useCategoryStore, Category } from '~/store/categoryStore';
import { useSettingsStore } from '~/store/settingsStore';
import { useColorScheme } from '~/lib/useColorScheme';

// --- CONFIGURATION ---
const MAX_HEADER_HEIGHT = 220; // Expanded height
const MIN_HEADER_HEIGHT = 100; // Collapsed/Sticky height
const HEADER_DIFF = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

// Define a type for the data item passed to the FlatList (TransactionItem)
type TransactionItemProps = {
  item: Entry & { category?: Category };
};

// --- COMPONENTS ---

// 1. Transaction List Item Component
const TransactionItem = ({ item }: TransactionItemProps) => {
  const { currencySymbol } = useSettingsStore();
  const { showActionSheetWithOptions } = useActionSheet();
  const { colors, isDarkColorScheme } = useColorScheme();
  const { removeEntry } = useEntryStore();

  const category = item.category;
  const isIncome = category?.type === 'income';

  const amountText = `${isIncome ? '+' : '-'}${currencySymbol}${item.amount.toFixed(2)}`;

  // Dynamic color for income/expense
  // Using standard Tailwind green/red as these are the common colors for finance apps
  const amountColorClass = isIncome
    ? 'text-green-500 dark:text-green-400'
    : 'text-red-500 dark:text-red-400';

  const confirmDeleteEntry = (id: string) => {
    // Direct call to remove entry (soft delete)
    removeEntry(id, true);
  };

  const handlePress = () => {
    showActionSheetWithOptions(
      {
        options: ['Edit', 'Delete', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
        // Using dynamic colors from the useColorScheme hook for the action sheet
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
            router.push(`/edit-entry?id=${item.id}`);
            break;
          case 1:
            confirmDeleteEntry(item.id);
            break;
          case 2:
          // Cancel
        }
      }
    );
  };

  const renderIcon = () => {
    if (category?.iconImage) {
      return (
        <Image
          source={{ uri: category.iconImage }}
          className="h-8 w-8 rounded-full"
          resizeMode="contain"
        />
      );
    } else if (category?.icon) {
      return <Feather name={category.icon as any} size={20} color={category.color ?? 'white'} />;
    }
    // Fallback icon
    return <Text className="text-lg font-bold text-primary">{category?.name[0] || '?'}</Text>;
  };

  return (
    <Pressable
      className="mb-2 flex-row items-center rounded-xl bg-card p-3 shadow-md shadow-gray-200 dark:shadow-black/20"
      onPress={handlePress}>
      {/* Icon Container with subtle background based on type */}
      <View
        className={`mr-4 h-10 w-10 items-center justify-center rounded-full ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
        {renderIcon()}
      </View>

      {/* Details */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
          {item.note || 'No description'}
        </Text>
        <Text className="mt-0.5 text-xs text-muted-foreground">
          {category?.name || 'Unknown Category'} • {new Date(item.date).toLocaleTimeString()}
        </Text>
      </View>

      {/* Amount */}
      <Text className={`text-lg font-bold ${amountColorClass}`}>{amountText}</Text>
    </Pressable>
  );
};

// 2. Main Home Component (exported as default)
export default function Home() {
  // --- State & Stores ---
  const { getEntriesByDate, removeEntry } = useEntryStore();
  const { currencySymbol } = useSettingsStore();
  const { categories } = useCategoryStore();
  const { colors, isDarkColorScheme } = useColorScheme();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [atEnd, setAtEnd] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Reanimated Shared Value
  const scrollY = useSharedValue(0);

  // --- Data Processing Logic ---
  const formattedDate = selectedDate.toISOString().split('T')[0];
  const dayEntries = getEntriesByDate(formattedDate).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const activeCategories = categories.filter((c) => !c.deletedAt);

  const incomeTotal = dayEntries
    .filter((e) => activeCategories.find((c) => c.id === e.categoryId)?.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const expenseTotal = dayEntries
    .filter((e) => activeCategories.find((c) => c.id === e.categoryId)?.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = incomeTotal - expenseTotal;

  const balanceColorClass =
    netBalance >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';

  // --- Handlers ---
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = event.contentOffset.y;
      scrollY.value = y <= HEADER_DIFF ? y : HEADER_DIFF;
    },
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 30;
    setAtEnd(layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom);
  };

  const confirmDeleteEntry = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogVisible(true);
  };

  const handleDeleteConfirmed = () => {
    if (entryToDelete) {
      removeEntry(entryToDelete, true);
      setEntryToDelete(null);
      setDeleteDialogVisible(false);
    }
  };

  // --- Reanimated Styles ---
  // 1. Header height animation (MAX_HEADER_HEIGHT -> MIN_HEADER_HEIGHT)
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_DIFF],
      [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT],
      'clamp'
    );
    // We use the computed height here
    return { height };
  });

  // 2. Expanded Card Content fade out
  const animatedCardContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, HEADER_DIFF * 0.75], [1, 0], 'clamp');
    const translateY = interpolate(scrollY.value, [0, HEADER_DIFF], [0, -20], 'clamp');
    return { opacity, transform: [{ translateY }] };
  });

  // 3. Sticky Title fade in
  const animatedStickyTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_DIFF * 0.8, HEADER_DIFF],
      [0, 0.2, 1],
      'clamp'
    );
    const scale = interpolate(scrollY.value, [0, HEADER_DIFF], [0.8, 1], 'clamp');
    return { opacity, transform: [{ scale }] };
  });

  // --- FlatList Renderer Functions ---
  const renderItem = useCallback(
    ({ item }: { item: Entry }) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      return <TransactionItem item={{ ...item, category }} />;
    },
    [categories, currencySymbol]
  );

  const keyExtractor = useCallback((item: Entry) => item.id, []);

  // --- Render ---
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* <StatusBar
        barStyle={isDarkColorScheme ? 'light-content' : 'dark-content'}
        backgroundColor={'#44d45cff'}
      /> */}

      {/* Collapsing Header Container */}
      <Animated.View
        style={[
          styles.headerContainer, // Absolute positioning requires StyleSheet
          animatedHeaderStyle,
        ]}
        // Tailwind classes for static styling
        className="overflow-hidden">
        {/* Background Card */}
        <View
          style={styles.headerBackground} // absoluteFillObject requires StyleSheet
          className="bg-card"
        />

        <View
          className="flex-1 justify-end px-4 pb-4"
          // Manual paddingTop required since StatusBar is dynamic
          style={{ paddingTop: (StatusBar.currentHeight || 0) + 10 }}>
          {/* Collapsed/Sticky Title (Net Balance) */}
          <Animated.Text
            style={[
              styles.stickyTitle, // Absolute positioning requires StyleSheet
              animatedStickyTitleStyle,
            ]}
            className={`text-2xl font-bold ${balanceColorClass}`}>
            {currencySymbol}
            {netBalance.toFixed(2)} Net
          </Animated.Text>

          {/* Expanded Card Content (Fades out) */}
          <Animated.View style={animatedCardContentStyle} className="w-full">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-base font-medium text-muted-foreground">Net Balance on</Text>
              <TouchableOpacity
                className="rounded-lg bg-primary px-3 py-1"
                onPress={() => setShowPicker(true)}>
                <Text className="text-sm font-semibold text-primary-foreground">
                  {selectedDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            <Text className={`mb-4 text-4xl font-extrabold ${balanceColorClass}`}>
              {currencySymbol}
              {netBalance.toFixed(2)}
            </Text>

            <View className="w-full flex-row justify-between pr-12">
              <View className="items-start">
                <Text className="mb-0.5 text-xs text-muted-foreground">Income</Text>
                <Text className="text-base font-semibold text-green-500 dark:text-green-400">
                  +{currencySymbol}
                  {incomeTotal.toFixed(2)}
                </Text>
              </View>
              <View className="items-start">
                <Text className="mb-0.5 text-xs text-muted-foreground">Expense</Text>
                <Text className="text-base font-semibold text-red-500 dark:text-red-400">
                  -{currencySymbol}
                  {expenseTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Transactions List */}
      <Animated.FlatList
        data={dayEntries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // Important: Pass both scroll handler functions
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{
          paddingTop: MAX_HEADER_HEIGHT, // CRITICAL padding
          paddingHorizontal: 16,
          paddingBottom: 100, // Ensure space for Floating button
        }}
        ListHeaderComponent={() => (
          <Text className="mb-2 mt-2 text-lg font-bold text-foreground">All Entries</Text>
        )}
        ListEmptyComponent={() => (
          <Text className="mt-5 text-center italic text-muted-foreground">
            No entries recorded for {selectedDate.toLocaleDateString()}.
          </Text>
        )}
      />

      {/* Date Picker */}
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

      {/* Delete Dialog */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Move to Trash?</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: colors.foreground }}>
              This will move the entry into trash. Are you sure?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={() => setDeleteDialogVisible(false)}>Cancel</PaperButton>
            <PaperButton onPress={handleDeleteConfirmed}>OK</PaperButton>
          </Dialog.Actions>
        </Dialog>
        <FloatingButton visible={!atEnd || dayEntries.length === 0} />
      </Portal>
    </SafeAreaView>
  );
}

// Minimal StyleSheet required for React Native absolute positioning features
const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderColor: '#1B9F67',
    // borderColor: '#f7df08ff',
    // borderWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  stickyTitle: {
    position: 'absolute',
    bottom: 16,
    left: 20,
  },
});
