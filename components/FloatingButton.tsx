import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { FAB } from 'react-native-paper';

export default function FloatingButton({ atEnd }: { atEnd: boolean }) {
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const { open } = state;

  return (
    <FAB.Group
      open={open}
      visible
      icon={open ? 'calendar' : 'plus'}
      fabStyle={{
        opacity: atEnd ? 0.5 : 1,
        // transform: [{ translateX: -100 }, { translateY: -100 }],
      }}
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
          onPress: () => console.log('Pressed email'),
        },
        {
          icon: 'bell',
          label: 'Remind',
          onPress: () => console.log('Pressed notifications'),
        },
        {
          icon: 'plus-circle',
          label: 'New Entry',
          onPress: () => router.push('/add-entry'),
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
