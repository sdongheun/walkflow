import React, { useRef } from "react";
import { Text, View, Dimensions, TouchableOpacity, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { ArrowLeft, Navigation, HeartPulse } from "lucide-react-native";
import CountdownOverlay from "../components/CountdownOverlay";
import { syncHealthData } from "../utils/healthData";
import { useUserStore } from "../store/useUserStore";
import { getNearestCrosswalk } from "../utils/trafficApi";

type Props = NativeStackScreenProps<RootStackParamList, "Map">;

const { width, height } = Dimensions.get("window");

// Mock Data: 임시 사용자 위치 (김해시 삼방동 인근)
const MOCK_START = { latitude: 35.254106, longitude: 128.903344 };
// Mock Data: 목적지 (공공데이터 횡단보도를 지나가는 임의의 위치)
const MOCK_DEST = { latitude: 35.250106, longitude: 128.903344 };
// 공공데이터에서 가져온 횡단보도 위치
const nearestCrosswalk = getNearestCrosswalk(
  MOCK_START.latitude,
  MOCK_START.longitude,
);
const TARGET_CROSSWALK = {
  latitude: nearestCrosswalk.latitude,
  longitude: nearestCrosswalk.longitude,
};

export default function MapScreen({ route, navigation }: Props) {
  const { destinationName } = route.params;
  const { walkingSpeed, isHealthAppLinked } = useUserStore();

  const webViewRef = useRef<WebView>(null);
  const mapUrl = "https://map-web-six.vercel.app";

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'log') {
        console.log("[웹뷰 로그]", data.message);
      } else if (data.type === 'ready') {
        console.log("✅ Vercel 지도 준비 완료! 앱에서 좌표 데이터를 쏩니다.");
        const pointsData = [
          { latitude: MOCK_START.latitude, longitude: MOCK_START.longitude },
          { latitude: TARGET_CROSSWALK.latitude, longitude: TARGET_CROSSWALK.longitude },
          { latitude: MOCK_DEST.latitude, longitude: MOCK_DEST.longitude }
        ];

        // 준비된 Vercel 지도에게 점 3개의 좌표를 넘겨줌!
        webViewRef.current?.postMessage(JSON.stringify({
          type: 'INIT_MAP',
          points: pointsData
        }));
      }
    } catch (e) {
      console.log("JSON 파싱 에러:", e);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* 백그라운드 카카오맵 (플랫폼별 분기 처리) */}
      <View className="absolute top-0 w-full h-full">
        {Platform.OS === 'web' ? (
          <iframe
            src={mapUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Kakao Map"
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: mapUrl }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={handleWebViewMessage}
            style={{ flex: 1 }}
          />
        )}
      </View>

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
      <CountdownOverlay />
    </View>
  );
}
