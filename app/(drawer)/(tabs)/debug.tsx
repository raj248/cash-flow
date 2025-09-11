import { Stack } from 'expo-router';
import { Button } from '~/components/Button';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { useCategoryStore } from '~/store/categoryStore';
import { useEntryStore } from '~/store/entryStore';

export default function Debug() {
  const categories = useCategoryStore((s) => s.categories);
  const getEntriesByDate = useEntryStore((s) => s.getEntriesByDate);
  const populate = async () => {
    // populate test data
    useCategoryStore.getState().populateDummyData();
    useEntryStore.getState().populateDummyData();

    // check
    console.log('Categories:', useCategoryStore.getState().categories);
    console.log('Entries:', useEntryStore.getState().entries);
  };
  return (
    <>
      <Stack.Screen options={{ title: 'Tab Two' }} />
      <Button title="Populate Data" onPress={populate} />
      <Button title="Get Category" onPress={() => console.log(categories)} />
      <Button
        title="Get Entry by date"
        onPress={() => console.log(getEntriesByDate('2025-09-11'))}
      />
    </>
  );
}
