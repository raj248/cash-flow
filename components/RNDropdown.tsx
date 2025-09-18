import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { useCategoryStore } from '~/store/categoryStore';
import { useColorScheme } from '~/lib/useColorScheme';
import { darkTheme, lightTheme } from '~/theme/theme';

export default function CategoryDropdownPicker({
  categoryId,
  setCategoryId,
}: {
  categoryId: string | undefined;
  setCategoryId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const categories = useCategoryStore((s) => s.categories);
  const getCategoryIcon = useCategoryStore((s) => s.getCategoryIcon);
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? darkTheme.colors : lightTheme.colors;

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    categories.map((c) => ({
      label: c.name,
      value: c.id,
    }))
  );

  const renderCategoryIcon = (id: string) => {
    const icons = getCategoryIcon(id);
    if (icons?.iconImage) {
      return (
        <Image
          source={{ uri: icons.iconImage }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            marginRight: 8,
          }}
          resizeMode="contain"
        />
      );
    } else if (icons?.icon) {
      return (
        <Feather
          name={icons.icon as any}
          size={24}
          color={icons.color ?? theme.onSurface}
          style={{ marginRight: 8 }}
        />
      );
    }
    return null;
  };

  return (
    <View style={{ zIndex: 1000 }}>
      <DropDownPicker
        theme={isDarkColorScheme ? 'DARK' : 'LIGHT'}
        open={open}
        value={categoryId ?? ''}
        items={items}
        setOpen={setOpen}
        setValue={setCategoryId}
        onSelectItem={(item) => {
          console.log('Selected:', item.value);
        }}
        setItems={setItems}
        placeholder="Select Category"
        listMode="MODAL"
        closeAfterSelecting
        closeOnBackPressed
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.outline,
        }}
        dropDownContainerStyle={{
          backgroundColor: theme.surface,
          borderColor: theme.outline,
        }}
        placeholderStyle={{
          color: theme.onSurfaceVariant,
        }}
        labelStyle={{
          color: theme.onSurface,
        }}
        selectedItemLabelStyle={{
          fontWeight: '600',
          color: theme.primary,
        }}
        renderListItem={({ item }) => (
          <Pressable
            onPress={() => {
              console.log('Tapped:', item.value);
              setCategoryId(item.value as string);
              setOpen(false);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
            android_ripple={{ color: theme.outlineVariant }}>
            {renderCategoryIcon(item.value ?? '')}
            <Text style={{ color: theme.onSurface }}>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
