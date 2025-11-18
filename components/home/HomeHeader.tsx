import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Text } from '~/components/nativewindui/Text';

interface Props {
  scrollY: Animated.SharedValue<number>;
}

export function HomeHeader({ scrollY }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(scrollY.value, [0, 200], [200, 90], 'clamp'),
    };
  });

  return (
    <Animated.View style={animatedStyle} className="justify-end rounded-b-3xl bg-primary p-5">
      <Text variant="title1" className="font-bold text-white">
        Today’s Overview
      </Text>
      <Text variant="largeTitle" className="font-bold text-white">
        ₹ 1,240
      </Text>
    </Animated.View>
  );
}
