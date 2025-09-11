import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { useCategoryStore } from '~/store/categoryStore';

export default function CategoryDropdownPicker({
  categoryId,
  setCategoryId,
}: {
  categoryId: string | undefined;
  setCategoryId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const categories = useCategoryStore((s) => s.categories);
  const getCategoryIcon = useCategoryStore((s) => s.getCategoryIcon);

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
          style={{ width: 28, height: 28, borderRadius: 6, marginRight: 8 }}
          resizeMode="contain"
        />
      );
    } else if (icons?.icon) {
      return (
        <Feather
          name={icons.icon as any}
          size={24}
          color={icons.color ?? 'black'}
          style={{ marginRight: 8 }}
        />
      );
    }
    return null;
  };

  return (
    <View style={{ zIndex: 1000 }}>
      <DropDownPicker
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
        closeAfterSelecting={true} // ✅ closes dropdown on selection
        closeOnBackPressed={true} // ✅ closes dropdown on back press
        renderListItem={({ item, onPress }) => (
          <Pressable
            onPress={() => {
              console.log('Tapped:', item.value);
              setCategoryId(item.value as string);
              setOpen(false);
              //   onPress(item.value as string);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}
            android_ripple={{ color: '#ddd' }} // nice ripple effect on Android
          >
            {renderCategoryIcon(item.value ?? '')}
            <Text>{item.label}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
