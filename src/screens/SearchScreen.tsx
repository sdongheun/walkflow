import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import SearchInput from "../components/SearchInput";
import PrimaryButton from "../components/PrimaryButton";

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Search"
>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (destination.trim()) {
      navigation.navigate("Map", { destinationName: destination });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-10">
          <Text className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            어디로 가겠습니까?
          </Text>
          <Text className="text-base text-gray-500 leading-relaxed">
            가장 빠른 횡단보도 대기 시간을 안내해 드릴게요.
          </Text>
        </View>

        <SearchInput
          placeholder="목적지를 입력하세요 (예: 학교, 강남역)"
          value={destination}
          onChangeText={setDestination}
          onSubmit={handleSearch}
          autoFocus={true}
        />

        <PrimaryButton
          title="길찾기"
          onPress={handleSearch}
          disabled={!destination.trim()}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
