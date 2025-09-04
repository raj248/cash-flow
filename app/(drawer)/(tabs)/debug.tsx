import { Stack } from 'expo-router';
import { Button } from '~/components/Button';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { useCategoryStore } from '~/store/categoryStore';

export default function Home() {
  const categories = useCategoryStore((s) => s.categories);
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Button title="Get Category" onPress={() => console.log(categories)} />
    </>
  );
}
