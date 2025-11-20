import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { Text } from '~/components/nativewindui/Text';

const TABS = ['Today', 'Weekly', 'Monthly'] as const;

interface Props {
  scrollY: Animated.SharedValue<number>;
  activeTab: string;
  setActiveTab: (t: string) => void;
}

export function HomeTabs({ scrollY, activeTab, setActiveTab }: Props) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 200], [1, 1]),
  }));

  return (
    <Animated.View style={style} className="rounded-b-3xl bg-primary px-6 pb-3 pt-4">
      <View className="flex-row justify-around">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Pressable key={tab} onPress={() => setActiveTab(tab)}>
              <View
                className={`rounded-full px-4 py-2 ${isActive ? 'bg-white/25' : 'bg-transparent'}`}>
                <Text className={`${isActive ? 'font-semibold text-white' : 'text-white/70'}`}>
                  {tab}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}
