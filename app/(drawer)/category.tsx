import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import { useCategoryStore } from '~/store/categoryStore';
import { IconPicker } from '~/components/IconPicker';

export default function AddCategoryPage() {
  const { addCategory, removeCategory, categories } = useCategoryStore();

  const [name, setName] = useState('');
  const [income, setIncome] = useState(true);
  const [icon, setIcon] = useState<string | undefined>();
  const [iconImage, setIconImage] = useState<string | undefined>();

  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [], // ✅ new way
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (!uri) return;
      if (!FileSystem.documentDirectory) return;

      // Generate unique filename
      const fileName = uri.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        // Move file from cache → app data
        await FileSystem.moveAsync({
          from: uri,
          to: newPath,
        });

        console.log('Saved to app storage:', newPath);
        setIconImage(newPath); // update state with permanent path
      } catch (err) {
        console.error('Error saving file:', err);
      }
    }
  };
  const handleSave = () => {
    if (!name.trim()) return;

    addCategory({
      name,
      type: income ? 'income' : 'expense',
      icon,
      iconImage,
    });

    setName('');
    setIcon(undefined);
    setIconImage(undefined);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="mb-4 text-2xl font-bold">Add Category</Text>

      {/* Name Input */}
      <TextInput
        placeholder="Category name"
        value={name}
        onChangeText={setName}
        className="mb-4 rounded-xl bg-white p-3"
      />

      {/* Income / Expense Toggle */}
      <View className="mb-4 flex-row">
        <TouchableOpacity
          onPress={() => setIncome(true)}
          className={`flex-1 rounded-l-xl p-3 ${income ? 'bg-green-500' : 'bg-gray-300'}`}>
          <Text className="text-center font-semibold text-white">Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIncome(false)}
          className={`flex-1 rounded-r-xl p-3 ${!income ? 'bg-red-500' : 'bg-gray-300'}`}>
          <Text className="text-center font-semibold text-white">Expense</Text>
        </TouchableOpacity>
      </View>

      {/* <IconPicker
        selectedIcon={icon}
        onSelect={(iconName) => {
          setIcon(iconName);
          setIconImage(undefined); // clear custom image
        }}
      /> */}

      {/* Icon Picker (Feather) */}
      <View className="mb-4 flex-row flex-wrap items-center justify-center">
        {[
          'home',
          'briefcase',
          'shopping-cart',
          'shopping-bag',
          'credit-card',
          'book',
          'tv',
          'map-pin',
          'coffee',
          'wifi',
        ].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              setIcon(i);
              setIconImage(undefined); // clear custom image
            }}
            className={`m-1 rounded-xl p-4 ${icon === i ? 'bg-blue-200' : 'bg-white'}`}>
            <Feather name={i as any} size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Image Picker */}
      <TouchableOpacity
        onPress={pickImage}
        className="mb-4 items-center rounded-xl bg-blue-100 p-4">
        <Text className="font-semibold text-blue-700">Pick Custom Icon</Text>
      </TouchableOpacity>
      {iconImage && <Image source={{ uri: iconImage }} className="mb-4 h-20 w-20" />}

      {/* Save Button */}
      <TouchableOpacity onPress={handleSave} className="rounded-xl bg-blue-500 p-4">
        <Text className="text-center font-bold text-white">Save Category</Text>
      </TouchableOpacity>

      {/* Current Categories List */}
      <Text className="mb-2 text-xl font-semibold">Your Categories</Text>
      {categories.length === 0 && <Text className="text-gray-500">No categories added yet.</Text>}
      {categories.map((c, idx) => (
        <View key={idx} className="mb-3 flex-row items-center rounded-xl bg-white p-3 shadow">
          {/* Show icon */}
          {c.iconImage ? (
            <Image source={{ uri: c.iconImage }} className="mr-3 h-10 w-10 rounded-full" />
          ) : c.icon ? (
            <Feather
              name={c.icon as any}
              size={24}
              color={c.type === 'income' ? 'green' : 'red'}
              style={{ marginRight: 12 }}
            />
          ) : null}

          {/* Name + Type */}
          <View className="flex-1">
            <Text className="font-bold">{c.name}</Text>
            <Text className="text-xs text-gray-500">
              {c.type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={() => removeCategory(c.name)}
            className="rounded-lg bg-red-100 px-3 py-1">
            <Text className="text-red-600">Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
