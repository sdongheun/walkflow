import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { Search } from "lucide-react-native";

interface SearchInputProps extends TextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export default function SearchInput({
  placeholder = "목적지를 입력하세요",
  value,
  onChangeText,
  onSubmit,
  ...props
}: SearchInputProps) {
  return (
    <View className="w-full relative">
      <View className="absolute left-4 top-5 z-10">
        <Search size={20} color="#9CA3AF" />
      </View>
      <TextInput
        className="h-16 bg-gray-100 rounded-2xl pl-12 pr-5 text-lg text-gray-900 mb-5 border border-transparent focus:border-blue-500 focus:bg-white"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        {...props}
      />
    </View>
  );
}
