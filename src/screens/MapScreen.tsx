import React from "react";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { ArrowLeft, Navigation, HeartPulse } from "lucide-react-native";
import CountdownOverlay from "../components/CountdownOverlay";
import { syncHealthData } from "../utils/healthData";
import { useUserStore } from "../store/useUserStore";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

const { width, height } = Dimensions.get("window");

// Mock data (temporary, for UI demo)
const MOCK_START = { latitude: 37.4979, longitude: 127.0276 }; // 강남역
const MOCK_DEST = { latitude: 37.5, longitude: 127.03 };
const MOCK_CROSSWALK = { latitude: 37.4985, longitude: 127.0285 };

export default function MapScreen({ route, navigation }: Props) {
  const { destinationName } = route.params;
  const { walkingSpeed, isHealthAppLinked } = useUserStore();

  return (
    <View className="flex-1 bg-white">
      <MapView
        className="w-full h-full"
        initialRegion={{
          latitude: MOCK_START.latitude,
          longitude: MOCK_START.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
      >
        {/* 임시 경로 표시 */}
        <Polyline
          coordinates={[MOCK_START, MOCK_CROSSWALK, MOCK_DEST]}
          strokeColor="#3B82F6"
          strokeWidth={6}
        />

        {/* 횡단보도 마커 */}
        <Marker coordinate={MOCK_CROSSWALK} title="타겟 횡단보도">
          <View className="justify-center items-center">
            <View className="absolute w-10 h-10 rounded-full bg-blue-500/40" />
            <View className="bg-blue-500 p-1.5 rounded-2xl overflow-hidden">
              <Navigation size={20} color="white" />
            </View>
          </View>
        </Marker>
      </MapView>

      {/* 헤더 오버레이 - 뒤로가기 및 목적지 표시 */}
      <View className="absolute top-[60px] left-5 right-5 flex-row items-center">
        <TouchableOpacity
          className="w-11 h-11 rounded-full bg-white justify-center items-center shadow-sm"
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View className="ml-3 bg-white px-4 py-2.5 rounded-full shadow-sm flex-row items-center flex-1 justify-between">
          <Text className="text-base font-semibold text-gray-900">
            {destinationName}
          </Text>
        </View>
      </View>

      {/* 우측 상단 건강 정보 연동 버튼 */}
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

      {/* 카운트다운 타이머 오버레이 컴포넌트 */}
      <CountdownOverlay initialSeconds={165} />
    </View>
  );
}
