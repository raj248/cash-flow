import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function AppStatusBar() {
  const isDarkColorScheme = useColorScheme() === 'dark';

  return (
    <StatusBar
      key={`root-status-bar-${isDarkColorScheme ? 'dark' : 'light'}`}
      style={isDarkColorScheme ? 'light' : 'light'}
      animated
      backgroundColor={
        isDarkColorScheme
          ? 'rgba(0,0,0,0.8)' // dark mode background (semi-transparent black)
          : 'rgb(27,159,103)' // primary color from your new palette
      }
    />
  );
}
