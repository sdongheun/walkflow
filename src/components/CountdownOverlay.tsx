import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { getVirtualSignalStatus, SignalStatus } from "../utils/trafficApi";

export default function CountdownOverlay() {
  const [crosswalkType, setCrosswalkType] = useState<"A" | "B">("B");
  
  const [signal, setSignal] = useState<SignalStatus>(getVirtualSignalStatus(crosswalkType));

  useEffect(() => {
    const timer = setInterval(() => {
      // 시스템 시간에 이미 2:34:26 기준 로직이 trafficApi.ts 내부에 탑재되어 있음
      setSignal(getVirtualSignalStatus(crosswalkType));
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

  const isGreen = signal.isGreen;

  return (
    <View className="absolute bottom-[30px] left-5 right-5 bg-gray-900/95 rounded-[28px] p-5 items-center shadow-lg border border-gray-800">
      
      {/* 상단: A/B 횡단보도 토글 탭 */}
      <View className="flex-row bg-gray-800 p-1 rounded-xl mb-3 w-full">
        <TouchableOpacity 
          className={`flex-1 py-2 items-center rounded-lg ${crosswalkType === 'A' ? 'bg-blue-600' : ''}`}
          onPress={() => setCrosswalkType('A')}
        >
          <Text className={`font-bold ${crosswalkType === 'A' ? 'text-white' : 'text-gray-400'}`}>A 횡단보도</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 items-center rounded-lg ${crosswalkType === 'B' ? 'bg-blue-600' : ''}`}
          onPress={() => setCrosswalkType('B')}
        >
          <Text className={`font-bold ${crosswalkType === 'B' ? 'text-white' : 'text-gray-400'}`}>B 횡단보도</Text>
        </TouchableOpacity>
      </View>

      {/* 상태 및 시간 표시 */}
      <View
        className={`${
          isGreen ? "bg-green-500/20" : "bg-red-500/20"
        } px-4 py-1.5 rounded-xl mb-1`}
      >
        <Text
          className={`${
            isGreen ? "text-green-400" : "text-red-400"
          } text-[15px] font-semibold tracking-wide`}
        >
          {isGreen ? `${crosswalkType} 횡단보도 파란불` : `다음 파란불 대기`}
        </Text>
      </View>
      <Text
        className={`${
          isGreen ? "text-green-400" : "text-red-400"
        } text-7xl font-extrabold tracking-widest my-0`}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {formatTime(signal.timeRemaining)}
      </Text>

      {/* 텍스트 설명 */}
      <View className="flex-row items-center mt-3">
        <MapPin size={14} color="rgba(255,255,255,0.6)" />
        <Text className="text-white/60 text-xs ml-1.5">
          김해시 인제로 266 (02:34:26 기준 연동중)
        </Text>
      </View>
    </View>
  );
}
