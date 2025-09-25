import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import { useCategoryStore } from '~/store/categoryStore';
import { useColorScheme } from '~/lib/useColorScheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEntryStore } from '~/store/entryStore';

export default function AddCategoryPage() {
  const { addCategory, removeCategory, categories } = useCategoryStore();

  const [name, setName] = useState('');
  const [income, setIncome] = useState(true);
  const [icon, setIcon] = useState<string | undefined>();
  const [iconImage, setIconImage] = useState<string | undefined>();

  const { isDarkColorScheme } = useColorScheme();

  const pickImage = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      if (!uri || !FileSystem.documentDirectory) return;

      const fileName = uri.split('/').pop();
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        await FileSystem.moveAsync({ from: uri, to: newPath });
        setIconImage(newPath);
        setIcon(undefined); // clear feather icon
      } catch (err) {
        console.error('Error saving file:', err);
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    let base64Image: string | undefined;

    if (iconImage) {
      try {
        base64Image = await FileSystem.readAsStringAsync(iconImage, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (err) {
        console.error('Error reading base64:', err);
      }
    }

    addCategory({
      name,
      type: income ? 'income' : 'expense',
      icon,
      iconImage: base64Image ? `data:image/png;base64,${base64Image}` : iconImage,
      // 👆 stores as base64 if available, fallback to file path
    });

    // Reset form
    setName('');
    setIcon(undefined);
    setIconImage(undefined);
  };

  // filter un-deleted categories
  const activeCategories = categories.filter((c) => !c.deletedAt);
  // useEffect(() => {
  //   if (activeCategories.length === 0) {
  //     useCategoryStore.getState().populateDummyData();
  //     useEntryStore.getState().populateDummyData();
  //   }
  // }, [activeCategories.length]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
      <ScrollView className="flex-1 bg-background p-4" contentContainerStyle={{ gap: 20 }}>
        {/* Category Name */}
        <View className="rounded-xl bg-card p-4 shadow">
          <Text className="mb-2 font-semibold text-foreground">Category Name</Text>
          <TextInput
            placeholder="e.g. Salary, Food, Rent"
            placeholderTextColor={isDarkColorScheme ? '#9ca3af' : '#6b7280'}
            value={name}
            onChangeText={setName}
            className="rounded-lg bg-muted px-3 py-2 text-foreground"
          />
        </View>

        {/* Type Toggle */}
        <View className="rounded-xl bg-card p-4 shadow">
          <Text className="mb-2 font-semibold text-foreground">Type</Text>
          <View className="flex-row overflow-hidden rounded-lg border border-border">
            <TouchableOpacity
              onPress={() => setIncome(true)}
              className={`flex-1 p-3 ${income ? 'bg-green-500' : 'bg-muted'}`}>
              <Text
                className={`text-center font-semibold ${income ? 'text-white' : 'text-foreground'}`}>
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIncome(false)}
              className={`flex-1 p-3 ${!income ? 'bg-red-500' : 'bg-muted'}`}>
              <Text
                className={`text-center font-semibold ${!income ? 'text-white' : 'text-foreground'}`}>
                Expense
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Icon Picker */}
        <View className="rounded-xl bg-card p-4 shadow">
          <Text className="mb-3 font-semibold text-foreground">Choose an Icon</Text>
          <View className="flex-row flex-wrap justify-center gap-2">
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
                className={`items-center justify-center rounded-lg p-3 ${
                  icon === i ? 'bg-primary/30' : 'bg-muted'
                }`}>
                <Feather name={i as any} size={22} color={isDarkColorScheme ? 'white' : 'black'} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Image */}
          <TouchableOpacity
            onPress={pickImage}
            className="mt-4 items-center rounded-lg border border-primary p-3">
            <Text className="font-semibold text-primary">+ Pick Custom Icon</Text>
          </TouchableOpacity>

          {iconImage && (
            <View className="mt-3 items-center">
              <Image source={{ uri: iconImage }} className="h-16 w-16 rounded-lg" />
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} className="rounded-xl bg-primary p-4">
          <Text className="text-center font-bold text-primary-foreground">Save Category</Text>
        </TouchableOpacity>

        {/* Categories List */}
        <View>
          <Text className="mb-3 text-lg font-semibold text-foreground">Your Categories</Text>
          {activeCategories.length === 0 && (
            <Text className="text-muted-foreground">No categories added yet.</Text>
          )}
          {activeCategories.map((c) => (
            <View key={c.id} className="mb-3 flex-row items-center rounded-xl bg-card p-3 shadow">
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

              <View className="flex-1">
                <Text className="font-semibold text-foreground">{c.name}</Text>
                <Text className="text-xs text-muted-foreground">
                  {c.type === 'income' ? 'Income' : 'Expense'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Move to Trash?',
                    'This will move the category into trash. Are you sure?',
                    [
                      {
                        text: 'OK',
                        onPress: () => removeCategory(c.id, true),
                      },

                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                    ]
                  );
                }}
                className="bg-destructive/20 rounded-lg px-3 py-1">
                <Text className="text-destructive">Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
