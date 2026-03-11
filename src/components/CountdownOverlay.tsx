import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { MapPin } from "lucide-react-native";

interface CountdownOverlayProps {
  initialSeconds: number;
}

export default function CountdownOverlay({
  initialSeconds,
}: CountdownOverlayProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <View className="absolute bottom-[50px] left-5 right-5 bg-gray-900/90 rounded-[28px] p-6 items-center shadow-lg border border-gray-800">
      <View className="bg-blue-500/20 px-3 py-1.5 rounded-xl mb-2">
        <Text className="text-blue-400 text-sm font-semibold tracking-wide">
          다음 파란불까지 대기 없이
        </Text>
      </View>
      <Text
        className="text-white text-6xl font-extrabold tracking-widest my-1"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {formatTime(timeLeft)}
      </Text>
      <View className="flex-row items-center mt-2">
        <MapPin size={16} color="rgba(255,255,255,0.8)" />
        <Text className="text-white/80 text-sm ml-1.5">
          전방 횡단보도 연동 중
        </Text>
      </View>
    </View>
  );
}
