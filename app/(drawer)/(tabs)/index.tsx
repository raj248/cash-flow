import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { HomeHeader } from '~/components/home/HomeHeader';
import { Text } from '~/components/nativewindui/Text';

export default function Home() {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View className="flex-1">
      {/* Sticky Header + Collapsing */}
      <HomeHeader scrollY={scrollY} />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]} // <--- THIS makes it sticky
        className="flex-1">
        {/* Spacer so sticky header works correctly */}
        <View />

        {/* Main content */}
        <View className="gap-4 p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} className="rounded-xl bg-card p-5">
              <Text>{`Entry #${i + 1}`}</Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
