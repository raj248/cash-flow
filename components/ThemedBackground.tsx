import { useColorScheme } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export default function ThemedBackground({ children }: { children: React.ReactNode }) {
  const isDark = useColorScheme() === 'dark';

  const bg = useSharedValue('rgb(242,242,247)'); // light bg

  useEffect(() => {
    bg.value = withTiming(
      isDark ? 'rgb(0,0,0)' : 'rgb(242,242,247)', // your palette background
      { duration: 400 }
    );
  }, [isDark]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: bg.value,
  }));

  return <Animated.View style={[{ flex: 1 }, animatedStyle]}>{children}</Animated.View>;
}
