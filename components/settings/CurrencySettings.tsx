import { useState } from 'react';
import { View } from 'react-native';
import { Menu, Button as PaperButton } from 'react-native-paper';
import { Text } from '~/components/nativewindui/Text';
import { useSettingsStore } from '~/store/settingsStore';
import { CurrencyList } from '~/constants/currency';

export function CurrencySettings() {
  const { currencySymbol, setCurrencySymbol } = useSettingsStore();
  const [menuVisible, setMenuVisible] = useState(false);

  const currentCurrency = CurrencyList.find((c) => c.symbol === currencySymbol);

  return (
    <View className="gap-1">
      {/* Top Row: Label + Menu Trigger */}
      <View className="flex-row items-center justify-between">
        <Text variant="subhead" className="font-medium">
          Currency
        </Text>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <PaperButton mode="outlined" onPress={() => setMenuVisible(true)}>
              {currencySymbol} {currentCurrency?.label}
            </PaperButton>
          }>
          {CurrencyList.map((c) => (
            <Menu.Item
              key={c.code}
              onPress={() => {
                setCurrencySymbol(c.symbol);
                setMenuVisible(false);
              }}
              title={`${c.symbol} ${c.label}`}
            />
          ))}
        </Menu>
      </View>

      {/* Subtext */}
      <Text color="tertiary" variant="footnote" className="ml-1">
        Selected currency will reflect across all analytics, lists, and totals.
      </Text>
    </View>
  );
}
