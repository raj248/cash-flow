import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { useColorScheme } from '~/lib/useColorScheme';
import { useSettingsStore } from '~/store/settingsStore';
import { Button } from '~/components/Button';

export default function SettingsScreen() {
  const { colors, colorScheme } = useColorScheme();
  const { trashRetentionDays, setTrashRetentionDays } = useSettingsStore();

  return (
    <>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : colorScheme === 'dark' ? 'light' : 'dark'}
      />
      <View className="flex-1 gap-6 p-6">
        <Text variant="title3" className="font-semibold">
          Settings
        </Text>

        {/* Retention Days Setting */}
        <View className="gap-2">
          <Text variant="subhead">Trash Retention (days)</Text>
          <TextInput
            mode="outlined"
            keyboardType="numeric"
            value={trashRetentionDays.toString()}
            onChangeText={(val) => {
              const num = parseInt(val, 10);
              if (!isNaN(num) && num > 0) {
                setTrashRetentionDays(num);
              }
            }}
          />
          <Text color="tertiary" variant="footnote">
            Entries in trash older than {trashRetentionDays} days will be purged automatically.
          </Text>
        </View>

        {/* Example: Go back button */}
        <Button title="Back" onPress={() => {}} />
      </View>
    </>
  );
}
