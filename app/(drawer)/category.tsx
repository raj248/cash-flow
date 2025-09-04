import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import { useCategoryStore } from '~/store/categoryStore';

export default function AddCategoryPage() {
  const addCategory = useCategoryStore((s) => s.addCategory);

  const [name, setName] = useState('');
  const [income, setIncome] = useState(true);
  const [icon, setIcon] = useState<string | undefined>();
  const [iconImage, setIconImage] = useState<string | undefined>();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setIconImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    addCategory({
      name,
      income,
      icon,
      iconImage,
    });

    setName('');
    setIcon(undefined);
    setIconImage(undefined);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
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

      {/* Icon Picker (Feather) */}
      <View className="mb-4 flex-row flex-wrap">
        {['home', 'briefcase', 'shopping-cart', 'dollar-sign'].map((i) => (
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
    </View>
  );
}
