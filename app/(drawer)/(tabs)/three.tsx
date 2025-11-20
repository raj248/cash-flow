import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, StatusBar } from 'react-native';
// Note: We use the full Reanimated imports for clarity in a single file
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

// --- CONFIGURATION ---
const MAX_HEADER_HEIGHT = 200; // Height of the card when fully expanded
const MIN_HEADER_HEIGHT = 100; // Height of the sticky header when collapsed
const HEADER_DIFF = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;

// Mock data for transactions
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    description: 'Grocery Shopping',
    category: 'Food',
    amount: -45.75,
    date: '2023-11-15',
  },
  {
    id: '2',
    description: 'Monthly Salary',
    category: 'Income',
    amount: 3500.0,
    date: '2023-11-14',
  },
  {
    id: '3',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    amount: -15.49,
    date: '2023-11-13',
  },
  { id: '4', description: 'Gas Refill', category: 'Transport', amount: -62.1, date: '2023-11-13' },
  {
    id: '5',
    description: 'Investment Deposit',
    category: 'Savings',
    amount: -500.0,
    date: '2023-11-12',
  },
  {
    id: '6',
    description: 'Dinner with friends',
    category: 'Food',
    amount: -88.5,
    date: '2023-11-12',
  },
  {
    id: '7',
    description: 'Freelance Payment',
    category: 'Income',
    amount: 750.0,
    date: '2023-11-11',
  },
  { id: '8', description: 'Coffee Shop', category: 'Food', amount: -5.5, date: '2023-11-10' },
  {
    id: '9',
    description: 'Online Course',
    category: 'Education',
    amount: -199.0,
    date: '2023-11-09',
  },
  {
    id: '10',
    description: 'Gym Membership',
    category: 'Health',
    amount: -40.0,
    date: '2023-11-08',
  },
  { id: '11', description: 'Utility Bill', category: 'Bills', amount: -120.0, date: '2023-11-07' },
  { id: '12', description: 'Bonus', category: 'Income', amount: 100.0, date: '2023-11-06' },
  { id: '13', description: 'New Shoes', category: 'Shopping', amount: -70.0, date: '2023-11-05' },
  {
    id: '14',
    description: 'Grocery Shopping 2',
    category: 'Food',
    amount: -25.75,
    date: '2023-11-04',
  },
  {
    id: '15',
    description: 'Movie Tickets',
    category: 'Entertainment',
    amount: -30.0,
    date: '2023-11-03',
  },
  {
    id: '16',
    description: 'Public Transport',
    category: 'Transport',
    amount: -10.0,
    date: '2023-11-02',
  },
  { id: '17', description: 'Gift Purchase', category: 'Gifts', amount: -55.0, date: '2023-11-01' },
  { id: '18', description: 'Interest Earned', category: 'Income', amount: 5.5, date: '2023-10-31' },
];

// --- COMPONENTS ---

// Transaction list item component
const TransactionItem = ({ item }: { item: any }) => {
  const isExpense = item.amount < 0;
  const amountText = isExpense
    ? `$${Math.abs(item.amount).toFixed(2)}`
    : `+$${item.amount.toFixed(2)}`;

  return (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        {/* Simple Icon placeholder */}
        <Text style={styles.iconText}>{item.category[0]}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Text style={styles.categoryText}>
          {item.category} • {item.date}
        </Text>
      </View>
      <Text style={[styles.amountText, isExpense ? styles.expense : styles.income]}>
        {amountText}
      </Text>
    </View>
  );
};

// Main App Component
export default function three() {
  // Shared value to track the scroll position
  const scrollY = useSharedValue(0);

  // Animated Scroll Handler to update the shared value
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Clamp the scroll Y value between 0 and the HEADER_DIFF (100)
      const y = event.contentOffset.y;
      if (y <= HEADER_DIFF) {
        scrollY.value = y;
      } else {
        scrollY.value = HEADER_DIFF;
      }
    },
  });

  // 1. Animated Style for the main header container (changing height)
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_DIFF],
      [MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      height,
    };
  });

  // 2. Animated Style for the main card content (fading out as it collapses)
  const animatedCardContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_DIFF * 0.5, HEADER_DIFF],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(scrollY.value, [0, HEADER_DIFF], [0, -20], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // 3. Animated Style for the sticky header title (fading in as it collapses)
  const animatedStickyTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_DIFF * 0.8, HEADER_DIFF],
      [0, 0.2, 1],
      Extrapolate.CLAMP
    );
    const scale = interpolate(scrollY.value, [0, HEADER_DIFF], [0.8, 1], Extrapolate.CLAMP);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Static function for FlatList key
  const keyExtractor = useCallback((item: any) => item.id, []);

  // Static function to render list item
  const renderItem = useCallback(({ item }: { item: any }) => <TransactionItem item={item} />, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />

      {/* Collapsing Header Container */}
      <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          {/* Collapsed/Sticky Title */}
          <Animated.Text style={[styles.stickyTitle, animatedStickyTitleStyle]}>
            $2,763.16 Net
          </Animated.Text>

          {/* Expanded Card Content (Fades out) */}
          <Animated.View style={[styles.cardContent, animatedCardContentStyle]}>
            <Text style={styles.title}>Current Net Balance</Text>
            <Text style={styles.balanceText}>$2,763.16</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Income</Text>
                <Text style={styles.summaryValue}>+$4,350.00</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Expense</Text>
                <Text style={styles.summaryValueExpense}>-$1,586.84</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Transactions List */}
      <Animated.FlatList // Use Animated.FlatList here explicitly for better compatibility
        data={MOCK_TRANSACTIONS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // Important: Use Animated.FlatList and pass the handler
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Standard practice for smooth scrolling/animation
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => <Text style={styles.listHeaderTitle}>Recent Transactions</Text>}
      />
    </SafeAreaView>
  );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  // --- Header Styles ---
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it sits above the list
    overflow: 'hidden',
    // Start height is set dynamically by animatedHeaderStyle
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4f46e5', // Indigo-600
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 0 + 10 || 40,
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  // Sticky title that shows when collapsed
  stickyTitle: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  // Expanded card content
  cardContent: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    color: '#eef2ff', // Indigo-100
    marginBottom: 4,
    fontWeight: '500',
  },
  balanceText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 80,
  },
  summaryItem: {
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#c7d2fe', // Indigo-200
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a7f3d0', // Green-200
  },
  summaryValueExpense: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fecaca', // Red-200
  },
  // --- List Styles ---
  listContent: {
    // This padding is CRITICAL: It creates the space for the header to sit above the list
    paddingTop: MAX_HEADER_HEIGHT,
    paddingHorizontal: 16,
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 10,
    marginBottom: 10,
  },
  // --- Transaction Card Styles ---
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff', // Blue-50
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8', // Blue-700
  },
  detailsContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  expense: {
    color: '#ef4444', // Red-500
  },
  income: {
    color: '#10b981', // Green-500
  },
});

// export default function three() {
//   return <Text>three</Text>;
// }
