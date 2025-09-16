// import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { TabBarIcon } from '~/components/TabBarIcon';

import { Stack, withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

// Create a top tab navigator
const { Navigator } = createMaterialTopTabNavigator();

// Wrap it so Expo Router can use it as <Tabs />
export const Tabs = withLayoutContext(Navigator);

const NoRippleButton = ({ children, onPress, style }: any) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);
export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <Tabs
        tabBarPosition="top"
        screenOptions={{
          // headerShown: false,
          tabBarActiveTintColor: 'black',
          swipeEnabled: true, // 👈 enables left/right swipe

          // tabBarButton: (props) => <NoRippleButton {...props} />,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tab One',
            tabBarIcon: ({ name, color }: { name: string; color: string }) => (
              <TabBarIcon name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'Tab Two',
            tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="code" color={color} />,
          }}
        />
        <Tabs.Screen
          name="debug"
          options={{
            title: 'Debug',
            tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="box" color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
