import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { Button } from '~/components/Button';
export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      {/* get receive sms permission */}
      <Button
        title="Request SMS Permission"
        onPress={async () => {
          const granted = await requestSmsPermission();
          if (granted) {
            console.log('SMS permission granted');
          } else {
            console.log('SMS permission denied');
          }
        }}
      />

      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/two.tsx" title="Tab Two" />
      </Container>
    </>
  );
}

import { PermissionsAndroid, Platform } from 'react-native';

async function requestSmsPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
      title: 'SMS Permission',
      message: 'This app needs access to read your SMS to detect transaction messages.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    });

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return false;
}
