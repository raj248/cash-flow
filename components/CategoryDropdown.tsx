import { Pressable, View, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { useCategoryStore } from '~/store/categoryStore';
import { Dropdown, DropdownItemProps } from 'react-native-paper-dropdown';
export default function CategoryDropdown({
  categoryId,
  setCategoryId,
  setShowDropDown,
}: {
  categoryId: string | undefined;
  setCategoryId: (id: string | undefined) => void;
  setShowDropDown: (v: boolean) => void;
}) {
  const categories = useCategoryStore((s) => s.categories);
  const getCategoryIcon = useCategoryStore((s) => s.getCategoryIcon);

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const renderCategoryIcon = (cat: DropdownItemProps) => {
    const icons = getCategoryIcon(cat.option.value);
    if (icons?.iconImage) {
      return (
        <Image
          source={{ uri: icons?.iconImage }}
          style={{ width: 35, height: 35, borderRadius: 6, marginRight: 8 }}
          resizeMode="contain"
        />
      );
    } else if (icons?.icon) {
      return (
        <Feather
          name={icons?.icon as any}
          size={28}
          color={icons?.color ?? 'black'}
          style={{ marginRight: 8 }}
        />
      );
    }
    return null;
  };

  return (
    <Dropdown
      placeholder="Select Category"
      mode="outlined"
      menuDownIcon={() => <Feather name="chevron-down" size={20} />}
      menuUpIcon={() => <Feather name="chevron-up" size={20} />}
      CustomMenuHeader={() => (
        <View>
          <Text variant="titleSmall" style={{ padding: 8 }}>
            Select Category
          </Text>
        </View>
      )}
      value={categoryId ?? ''}
      onSelect={(s) => {
        console.log('Selected:', s);
        setCategoryId(s);
        setShowDropDown(false);
      }}
      options={categoryOptions}
      CustomDropdownItem={(item) => (
        <Pressable
          style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
          android_ripple={{ color: '#ddd' }}
          onPress={() => {
            setCategoryId(item.option.value);
            setShowDropDown(false);
          }}>
          {renderCategoryIcon(item)}
          <Text>{item.option.label}</Text>
        </Pressable>
      )}
    />
  );
}
