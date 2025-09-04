import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

const featherIcons = Object.keys(Feather.glyphMap); // all available icons

interface IconPickerProps {
  selectedIcon?: string;
  onSelect: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = featherIcons.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="mb-4">
      {/* Accordion header */}
      <TouchableOpacity
        onPress={() => setExpanded((prev) => !prev)}
        className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-gray-100 p-3">
        <Text className="text-base font-medium">Choose Icon</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>

      {expanded && (
        <View className="mt-2">
          {/* Search bar */}
          <TextInput
            placeholder="Search icon..."
            value={search}
            onChangeText={setSearch}
            className="mb-2 rounded-lg border border-gray-300 p-2"
          />

          {/* Icon grid */}
          <ScrollView style={{ maxHeight: 300 }}>
            <View className="flex-row flex-wrap justify-between">
              {filteredIcons.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => onSelect(item)}
                  className={`mb-2 w-[30%] items-center rounded-xl p-3 ${
                    selectedIcon === item ? 'bg-blue-200' : 'bg-white'
                  }`}>
                  <Feather name={item as any} size={28} color="black" />
                  <Text className="mt-1 text-xs">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}
