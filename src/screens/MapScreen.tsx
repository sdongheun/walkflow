import React from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import {
  NaverMapMarkerOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CountdownOverlay from "../components/CountdownOverlay";

const INTERSECTION_NAME = "인제대후문삼거리";
const INTERSECTION_COORDS = {
  latitude: 35.254106,
  longitude: 128.903344,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = insets.top + (Platform.OS === "android" ? 28 : 20);

  return (
    <View className="flex-1 bg-stone-100">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: topPadding,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5">
          <Text className="text-stone-900 text-3xl font-black">
            {INTERSECTION_NAME}
          </Text>
          <Text className="text-stone-500 text-sm mt-2">
            실시간 횡단보도 카운트다운
          </Text>
        </View>

        <CountdownOverlay />

        <View className="rounded-[28px] border border-stone-200 bg-white px-5 py-5 mt-4">
          <Text className="text-stone-900 text-lg font-black">
            {INTERSECTION_NAME}
          </Text>

          <View className="h-44 rounded-[22px] overflow-hidden mt-4 border border-stone-200">
            <NaverMapView
              style={{ width: "100%", height: "100%" }}
              camera={{
                latitude: INTERSECTION_COORDS.latitude,
                longitude: INTERSECTION_COORDS.longitude,
                zoom: 16,
              }}
              isShowLocationButton={false}
            >
              <NaverMapMarkerOverlay
                key="inje-backgate-intersection"
                latitude={INTERSECTION_COORDS.latitude}
                longitude={INTERSECTION_COORDS.longitude}
                caption={{ text: INTERSECTION_NAME }}
              />
            </NaverMapView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
