import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import { useCategoryStore } from '~/store/categoryStore';
import { useColorScheme } from '~/lib/useColorScheme';

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

  const { isDarkColorScheme } = useColorScheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="mb-4 text-2xl font-bold text-foreground">Add Category</Text>

      {/* Name Input */}
      <TextInput
        placeholder="Category name"
        placeholderTextColor={isDarkColorScheme ? '#9ca3af' : '#6b7280'}
        value={name}
        onChangeText={setName}
        className="mb-4 rounded-xl bg-card p-3 text-foreground"
      />

      {/* Income / Expense Toggle */}
      <View className="mb-4 flex-row">
        <TouchableOpacity
          onPress={() => setIncome(true)}
          className={`flex-1 rounded-l-xl p-3 ${income ? 'bg-green-500' : 'bg-muted'}`}>
          <Text
            className={`text-center font-semibold ${income ? 'text-white' : 'text-foreground'}`}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIncome(false)}
          className={`flex-1 rounded-r-xl p-3 ${!income ? 'bg-red-500' : 'bg-muted'}`}>
          <Text
            className={`text-center font-semibold ${!income ? 'text-white' : 'text-foreground'}`}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>

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
              setIconImage(undefined);
            }}
            className={`m-1 rounded-xl p-4 ${icon === i ? 'bg-primary/30' : 'bg-card'}`}>
            <Feather name={i as any} size={24} color={isDarkColorScheme ? 'white' : 'black'} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Image Picker */}
      <TouchableOpacity
        onPress={pickImage}
        className="bg-primary/20 mb-4 items-center rounded-xl p-4">
        <Text className="font-semibold text-primary">Pick Custom Icon</Text>
      </TouchableOpacity>
      {iconImage && <Image source={{ uri: iconImage }} className="mb-4 h-20 w-20" />}

      {/* Save Button */}
      <TouchableOpacity onPress={handleSave} className="rounded-xl bg-primary p-4">
        <Text className="text-center font-bold text-primary-foreground">Save Category</Text>
      </TouchableOpacity>

      {/* Current Categories List */}
      <Text className="mb-2 mt-4 text-xl font-semibold text-foreground">Your Categories</Text>
      {categories.length === 0 && (
        <Text className="text-muted-foreground">No categories added yet.</Text>
      )}
      {categories.map((c, idx) => (
        <View key={idx} className="mb-3 flex-row items-center rounded-xl bg-card p-3 shadow">
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
            <Text className="font-bold text-foreground">{c.name}</Text>
            <Text className="text-xs text-muted-foreground">
              {c.type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={() => removeCategory(c.id)}
            className="bg-destructive/20 rounded-lg px-3 py-1">
            <Text className="text-destructive">Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
