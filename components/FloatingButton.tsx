import { router, useSegments } from 'expo-router';
import { useState } from 'react';
import { FAB } from 'react-native-paper';

export default function FloatingButton({ visible }: { visible: boolean }) {
  const [state, setState] = useState({ open: false });
  const segments = useSegments();
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;
  console.log(segments);
  const forbiddenScreen = [
    'new-entry',
    '(tabs)',
    'settings',
    'import-export',
    'category',
    'analytics',
    'debug',
    'two',
  ];
  return (
    <FAB.Group
      open={open}
      visible={visible && (forbiddenScreen.includes(segments[segments.length - 1]) ? false : true)}
      icon={open ? 'calendar' : 'plus'}
      actions={[
        {
          icon: 'plus-circle',
          label: 'New Entry',
          onPress: () => router.push('/new-entry'),
        },
        {
          icon: 'grid',
          label: 'New Category',
          onPress: () => router.push('/(drawer)/category'),
        },
        {
          icon: 'activity',
          label: 'Analytics',
          onPress: () => router.push('/analytics'),
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
