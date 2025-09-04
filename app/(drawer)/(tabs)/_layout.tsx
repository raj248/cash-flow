import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { TabBarIcon } from '~/components/TabBarIcon';

const NoRippleButton = ({ children, onPress, style }: any) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={style}>
    {children}
  </TouchableOpacity>
);
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        // tabBarButton: (props) => <NoRippleButton {...props} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          tabBarIcon: ({ color }) => <TabBarIcon name="box" color={color} />,
        }}
      />
    </Tabs>
  );
}
