import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
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

// ✅ OpenStreetMap Nominatim API를 이용한 한국 장소 검색 (무료, API 키 불필요)
const searchPlace = async (keyword: string) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      keyword + " 대한민국"
    )}&format=json&limit=1&accept-language=ko`;

    const response = await fetch(url, {
      headers: {
        // Nominatim 정책 상 앱 이름/이메일을 User-Agent에 넣어야 합니다.
        "User-Agent": "WalkFlow/1.0",
      },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      const place = data[0];
      return {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
        name: place.display_name.split(",")[0], // 첫 번째 줄만 장소 이름으로 사용
      };
    }
    return null;
  } catch (error) {
    console.error("장소 검색 에러:", error);
    return null;
  }
};

export default function SearchScreen({ navigation }: Props) {
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!destination.trim()) return;

    setLoading(true);
    const coords = await searchPlace(destination);
    setLoading(false);

    if (coords) {
      navigation.navigate("Map", {
        destinationName: coords.name,
        destinationCoords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
    } else {
      Alert.alert(
        "장소를 찾을 수 없습니다",
        "좀 더 구체적인 주소나 장소 이름을 입력해 주세요.\n예: '인제대학교 김해캠퍼스', '부산 서면역'"
      );
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
          title={loading ? "검색 중..." : "길찾기"}
          onPress={handleSearch}
          disabled={!destination.trim() || loading}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
