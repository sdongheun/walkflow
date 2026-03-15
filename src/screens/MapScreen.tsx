import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import {
  NaverMapView,
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
} from "@mj-studio/react-native-naver-map";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { ArrowLeft, HeartPulse } from "lucide-react-native";
import CountdownOverlay from "../components/CountdownOverlay";
import { syncHealthData } from "../utils/healthData";
import { useUserStore } from "../store/useUserStore";
import * as Location from "expo-location";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

type Coord = { latitude: number; longitude: number };

export default function MapScreen({ route, navigation }: Props) {
  const { destinationName, destinationCoords } = route.params;
  const { walkingSpeed, isHealthAppLinked } = useUserStore();

  const [currentLocation, setCurrentLocation] = useState<Coord | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  // Render the map immediately and layer the current location in once we have it.
  useEffect(() => {
    async function getPos() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("위치 권한이 없어 기본 위치로 지도를 표시합니다.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("현재 위치 조회 에러:", error);
        setLocationError("현재 위치를 가져오지 못해 기본 위치로 지도를 표시합니다.");
      } finally {
        setIsLocating(false);
      }
    }

    getPos();
  }, []);

  const mapCenter =
    currentLocation ??
    destinationCoords ?? {
      latitude: 35.254106,
      longitude: 128.903344,
    };

  // 경로 포인트 (Tmap API 연동 전: 직선, 연동 후: 실제 도보 경로)
  const routeCoords: Coord[] = [
    ...(currentLocation ? [currentLocation] : []),
    ...(destinationCoords ? [destinationCoords] : []),
  ];

  return (
    <View className="flex-1 bg-white">
      {/* ✅ 지도 컨테이너 (배경으로 꽉 채움) */}
      <View className="absolute inset-0">
        <NaverMapView
          style={{ width: "100%", height: "100%" }}
          camera={{
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
            zoom: 16,
          }}
          isShowLocationButton={true}
        >
          {/* 내 위치 마커 */}
          {currentLocation && (
            <NaverMapMarkerOverlay
              key="current-location"
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              caption={{ text: "내 위치" }}
              width={24}
              height={24}
            />
          )}

          {/* 목적지 마커 */}
          {destinationCoords && (
            <NaverMapMarkerOverlay
              key="destination-location"
              latitude={destinationCoords.latitude}
              longitude={destinationCoords.longitude}
              caption={{ text: destinationName }}
            />
          )}

          {/* 경로 표시 */}
          {routeCoords.length >= 2 && (
            <NaverMapPathOverlay
              key="route-line"
              coords={routeCoords}
              color="#3B82F6"
              width={7}
            />
          )}
        </NaverMapView>
      </View>

      {/* 헤더 오버레이 */}
      <View className="absolute top-[60px] left-5 right-5 flex-row items-center">
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-sm"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View className="ml-3 bg-white px-4 py-2.5 rounded-full shadow-sm flex-row items-center flex-1">
          <Text className="text-base font-semibold text-gray-900">
            {destinationName}
          </Text>
        </View>
      </View>

      {/* 건강 정보 버튼 */}
      <View className="absolute top-[120px] right-5">
        <TouchableOpacity
          className={`flex-row items-center px-4 py-3 rounded-full shadow-sm ${
            isHealthAppLinked ? "bg-green-50" : "bg-white"
          }`}
          onPress={syncHealthData}
        >
          <HeartPulse
            size={20}
            color={isHealthAppLinked ? "#10B981" : "#EF4444"}
          />
          <Text
            className={`font-semibold ml-2 ${
              isHealthAppLinked ? "text-green-600" : "text-gray-700"
            }`}
          >
            {isHealthAppLinked ? `${walkingSpeed}m/s` : "건강 앱 연동"}
          </Text>
        </TouchableOpacity>
      </View>

      {(isLocating || locationError) && (
        <View className="absolute top-[180px] left-5 right-5 bg-white/95 px-4 py-3 rounded-2xl shadow-sm">
          <Text className="text-sm text-gray-700">
            {locationError ?? "현재 위치를 확인하는 중입니다..."}
          </Text>
        </View>
      )}

      {/* 카운트다운 오버레이 */}
      <CountdownOverlay />
    </View>
  );
}
