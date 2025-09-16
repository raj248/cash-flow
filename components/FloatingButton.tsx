import { router, useSegments } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function FloatingButton({ visible }: { visible: boolean }) {
  const [state, setState] = useState({ open: false });
  const segments = useSegments();
  console.log('Segments : ', segments);
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  return (
    <FAB.Group
      open={open}
      visible={visible && (segments.length > 1 ? segments[1] !== '(tabs)' : true)}
      icon={open ? 'calendar' : 'plus'}
      actions={[
        { icon: 'plus', onPress: () => console.log('Pressed add') },
        {
          icon: 'star',
          label: 'Star',
          onPress: () => console.log('Pressed star'),
        },
        {
          icon: 'mail',
          label: 'Email',
          onPress: () => router.push('/(drawer)/analytics'),
        },
        {
          icon: 'bell',
          label: 'Remind',
          onPress: () => router.push('/expense-breakdown'),
        },
        {
          icon: 'plus-circle',
          label: 'New Entry',
          onPress: () => router.push('/new-entry'),
        },
      ]}
      onStateChange={onStateChange}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  );
}
