// Analytics.tsx
import { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { AnalyticsCategory } from '~/components/AnalyticsCategory';
import { AnalyticsChart } from '~/components/AnalyticsChart';
import { DateRangePicker } from '~/components/DateRangePicker';

export default function Analytics() {
  const [fromDate, setFromDate] = useState<Date>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [toDate, setToDate] = useState<Date>(new Date());

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView contentContainerClassName="p-4">
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
        <AnalyticsChart initialFrom={fromDate} initialTo={toDate} />
        <AnalyticsCategory initialFrom={fromDate} initialTo={toDate} />
      </ScrollView>
    </SafeAreaView>
  );
}
