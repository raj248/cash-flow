import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

import { HeaderButton } from '../../components/HeaderButton';

const DrawerLayout = () => (
  <Drawer backBehavior="history">
    <Drawer.Screen
      name="index"
      options={{
        headerTitle: 'Cash Flow ',
        drawerLabel: 'Today',
        drawerIcon: ({ size, color }) => <Feather name="home" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="analytics"
      options={{
        headerTitle: 'Analytics',
        drawerLabel: 'Analytics',
        drawerIcon: ({ size, color }) => <Feather name="activity" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="category"
      options={{
        headerTitle: 'Category',
        drawerLabel: 'Category',
        drawerIcon: ({ size, color }) => <Feather name="grid" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="import-export"
      options={{
        headerTitle: 'Backup & Restore',
        drawerLabel: 'Backup & Restore',
        drawerIcon: ({ size, color }) => <Feather name="cloud" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="settings"
      options={{
        headerTitle: 'Settings',
        drawerLabel: 'Settings',
        drawerIcon: ({ size, color }) => <Feather name="settings" size={size} color={color} />,
      }}
    />
    <Drawer.Screen
      name="(tabs)"
      options={{
        headerTitle: 'Tabs',
        drawerLabel: 'Tabs',
        drawerIcon: ({ size, color }) => <Feather name="airplay" size={size} color={color} />,
        headerRight: () => (
          <Link href="/modal" asChild>
            <HeaderButton />
          </Link>
        ),
      }}
    />
  </Drawer>
);

export default DrawerLayout;
