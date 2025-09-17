import { LayoutAnimation } from 'react-native';
import { useEffect } from 'react';
import { useColorScheme } from '~/lib/useColorScheme';

export default function useThemeAnimation() {
  const { isDarkColorScheme } = useColorScheme();
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isDarkColorScheme]);
}
