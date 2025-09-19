// Analytics.tsx
import { SafeAreaView, ScrollView } from 'react-native';
import { AnalyticsChart } from '~/components/AnalyticsChart';

export default function Analytics() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerClassName="p-4">
        <AnalyticsChart />
      </ScrollView>
    </SafeAreaView>
  );
}
