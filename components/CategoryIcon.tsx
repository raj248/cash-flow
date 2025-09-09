// components/CategoryIcon.tsx
import React from 'react';
import { Image, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useCategoryStore } from '~/store/categoryStore';

interface CategoryIconProps {
  categoryId: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId, size = 24, color }) => {
  const category = useCategoryStore((state) => state.categories.find((c) => c.id === categoryId));

  if (!category) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#ccc',
        }}
      />
    );
  }

  // If category has custom image, render it
  if (category.iconImage) {
    return (
      <Image
        source={{ uri: category.iconImage }}
        style={{
          width: size + 10,
          height: size + 10,
          //   borderRadius: size / 2,
        }}
        className="rounded"
        resizeMode="cover"
        // className="mr-2"
      />
    );
  }

  // Otherwise fallback to Feather icon
  if (category.icon) {
    return (
      <Feather name={category.icon as any} size={size} color={color || category.color || 'black'} />
    );
  }

  // Default fallback
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: category.color || '#ccc',
      }}
    />
  );
};
