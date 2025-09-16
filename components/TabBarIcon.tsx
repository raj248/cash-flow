import Feather from '@expo/vector-icons/Feather';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) => {
  const { isDarkColorScheme } = useColorScheme();
  return (
    <Feather
      size={28}
      style={styles.tabBarIcon}
      color={isDarkColorScheme ? 'white' : props.color}
      name={props.name}
    />
  );
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
