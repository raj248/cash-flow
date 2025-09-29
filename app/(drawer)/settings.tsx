import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { Menu, Button as PaperButton } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useSettingsStore } from '~/store/settingsStore';
import { useState } from 'react';

const OPTIONS = [3, 5, 10, 15, 30, 90];

export default function SettingsScreen() {
  const { colorScheme } = useColorScheme();
  const { trashRetentionDays, setTrashRetentionDays } = useSettingsStore();

  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <View className="flex-1 gap-6 p-6">
        {/* Retention Days Setting */}
        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text variant="subhead" className="font-medium">
              Trash Retention
            </Text>

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <PaperButton mode="outlined" onPress={() => setMenuVisible(true)}>
                  {trashRetentionDays} days
                </PaperButton>
              }>
              {OPTIONS.map((days) => (
                <Menu.Item
                  key={days}
                  onPress={() => {
                    setTrashRetentionDays(days);
                    setMenuVisible(false);
                  }}
                  title={`${days} days`}
                />
              ))}
            </Menu>
          </View>

          {/* Subtext directly under setting */}
          <Text color="tertiary" variant="footnote" className="ml-1">
            Entries in trash older than {trashRetentionDays} days will be purged automatically.
          </Text>
        </View>
      </View>
    </>
  );
}
