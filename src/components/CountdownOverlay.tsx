import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import {
  CrosswalkType,
  getPedestrianCountdown,
  PedestrianCountdown,
} from "../utils/weekdaySignalPrediction";

export default function CountdownOverlay() {
  const [crosswalkType, setCrosswalkType] = useState<CrosswalkType>("B");

  const [signal, setSignal] = useState<PedestrianCountdown>(
    getPedestrianCountdown(new Date(), crosswalkType),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSignal(getPedestrianCountdown(new Date(), crosswalkType));
    }, 1000);
    return () => clearInterval(timer);
  }, [crosswalkType]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isTransition = signal.status === "transition";
  const isGreen = signal.status === "stable" && signal.isGreen;
  const badgeClass = isTransition
    ? "bg-amber-500/20"
    : isGreen
      ? "bg-green-500/20"
      : "bg-red-500/20";
  const badgeTextClass = isTransition
    ? "text-amber-300"
    : isGreen
      ? "text-green-400"
      : "text-red-400";
  const countdownText = isTransition
    ? "--:--"
    : formatTime(signal.timeRemainingSec);
  const title = isTransition
    ? `${crosswalkType} 횡단보도 예측 불가`
    : isGreen
      ? `${crosswalkType} 횡단보도 파란불`
      : `다음 파란불 대기`;
  const detailText =
    signal.status === "transition"
      ? signal.message
      : `${signal.segmentLabel} · 다음 시작 ${signal.nextGreenAt
          .toTimeString()
          .slice(0, 8)}`;
  const segmentText = signal.segmentLabel;

  return (
    <View className="absolute bottom-[30px] left-5 right-5 bg-gray-900/95 rounded-[28px] p-5 items-center shadow-lg border border-gray-800">
      <View className="flex-row bg-gray-800 p-1 rounded-xl mb-3 w-full">
        <TouchableOpacity
          className={`flex-1 py-2 items-center rounded-lg ${crosswalkType === "A" ? "bg-blue-600" : ""}`}
          onPress={() => setCrosswalkType("A")}
        >
          <Text
            className={`font-bold ${crosswalkType === "A" ? "text-white" : "text-gray-400"}`}
          >
            A 횡단보도 (4현시)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 items-center rounded-lg ${crosswalkType === "B" ? "bg-blue-600" : ""}`}
          onPress={() => setCrosswalkType("B")}
        >
          <Text
            className={`font-bold ${crosswalkType === "B" ? "text-white" : "text-gray-400"}`}
          >
            B 횡단보도 (2현시)
          </Text>
        </TouchableOpacity>
      </View>

      <View className={`${badgeClass} px-4 py-1.5 rounded-xl mb-1`}>
        <Text
          className={`${badgeTextClass} text-[15px] font-semibold tracking-wide`}
        >
          {title}
        </Text>
      </View>
      <Text
        className={`${badgeTextClass} text-7xl font-extrabold tracking-widest my-0`}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {countdownText}
      </Text>

      <Text className="text-white/80 text-sm text-center mt-3">
        {detailText}
      </Text>

      <View className="flex-row items-center mt-2">
        <MapPin size={14} color="rgba(255,255,255,0.6)" />
        <Text className="text-white/60 text-xs ml-1.5">
          교차로 1번 · {segmentText}
        </Text>
      </View>
    </View>
  );
}
