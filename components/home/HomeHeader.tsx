import { View, Dimensions } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Text } from '~/components/nativewindui/Text';

interface Props {
  scrollY: Animated.SharedValue<number>;
}

export function HomeHeader({ scrollY }: Props) {
  const screenH = Dimensions.get('window').height;

  const HEADER_EXPANDED = screenH * 0.25; // Responsive
  const HEADER_COLLAPSED = screenH * 0.08; // Responsive08
  const COLLAPSE_DISTANCE = HEADER_EXPANDED - HEADER_COLLAPSED;

  // Container height
  const containerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [HEADER_EXPANDED, HEADER_COLLAPSED],
      'clamp'
    ),
  }));

  // Expanded title (big)
  const expandedTitleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE_DISTANCE * 0.6], [1, 0], 'clamp'),
  }));

  // Expanded amount
  const expandedAmountStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, COLLAPSE_DISTANCE * 0.6], [1, 0], 'clamp'),
  }));

  // Compact mode
  const compactStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.4, COLLAPSE_DISTANCE],
      [0, 1],
      'clamp'
    ),
  }));

  return (
    <Animated.View style={containerStyle} className="justify-end rounded-b-3xl bg-primary p-5">
      {/* FULL EXPANDED MODE */}
      <Animated.View style={[expandedTitleStyle]} className="absolute bottom-16 left-5">
        <Text variant="title1" className="font-bold text-white">
          Today’s Overview
        </Text>
      </Animated.View>

      <Animated.View style={[expandedAmountStyle]} className="absolute bottom-5 left-5">
        <Text variant="largeTitle" className="font-bold text-white">
          ₹ 1,240
        </Text>
      </Animated.View>

      {/* COMPACT MODE */}
      <Animated.View style={[compactStyle]} className="flex-row items-center justify-between">
        <Text className="text-xl font-bold text-white">Today’s Overview</Text>
        <Text className="text-xl font-bold text-white">₹ 1,240</Text>
      </Animated.View>
    </Animated.View>
  );
}
