import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  CrosswalkType,
  getPedestrianCountdown,
  PedestrianCountdown,
  UpcomingGreenSlot,
} from "../utils/weekdaySignalPrediction";

const CROSSWALK_ORDER: CrosswalkType[] = ["B", "A"];

const CROSSWALK_NAME: Record<CrosswalkType, string> = {
  A: "인제대쪽",
  B: "쟈기집",
};

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatRelative(totalSeconds: number): string {
  if (totalSeconds <= 0) {
    return "지금";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}초 뒤`;
  }

  return `${minutes}분 ${seconds.toString().padStart(2, "0")}초 뒤`;
}

function formatHourMinute(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

function ForecastRow({
  slot,
  index,
  accent,
}: {
  slot: UpcomingGreenSlot;
  index: number;
  accent: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-2.5">
      <Text className={accent ? "text-emerald-900 text-sm" : "text-stone-600 text-sm"}>
        {index + 1}번째
      </Text>
      <Text
        className={
          accent
            ? "text-emerald-950 text-base font-bold"
            : "text-stone-900 text-base font-bold"
        }
      >
        {slot.isCurrent
          ? `지금 (${formatHourMinute(slot.startsAt)})`
          : `${formatRelative(slot.secondsUntilStart)} (${formatHourMinute(
              slot.startsAt,
            )})`}
      </Text>
    </View>
  );
}

function CrosswalkCard({ signal }: { signal: PedestrianCountdown }) {
  const title = CROSSWALK_NAME[signal.crosswalkType];

  if (signal.status === "transition") {
    return (
      <View className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-5">
        <Text className="text-stone-900 text-2xl font-black">{title}</Text>
        <Text className="text-amber-700 text-4xl font-black mt-5">--:--</Text>
        <Text className="text-amber-900 text-sm leading-6 mt-4">
          현재는 예측 불가 시간대입니다.
        </Text>
      </View>
    );
  }

  const isGreen = signal.isGreen;
  const surfaceClass = isGreen
    ? "bg-emerald-100 border-emerald-200"
    : "bg-rose-50 border-rose-200";
  const titleClass = isGreen ? "text-emerald-950" : "text-stone-900";
  const captionClass = isGreen ? "text-emerald-800" : "text-rose-700";
  const dividerClass = isGreen ? "border-emerald-200" : "border-rose-200";
  const countdownClass = isGreen ? "text-emerald-700" : "text-rose-700";
  const forecastTextClass = isGreen ? "text-emerald-950" : "text-rose-700";

  return (
    <View className={`rounded-[28px] border px-5 py-5 ${surfaceClass}`}>
      <Text className={`${titleClass} text-2xl font-black`}>{title}</Text>

      <Text
        className={`${countdownClass} text-[52px] font-black mt-5`}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {formatCountdown(signal.timeRemainingSec)}
      </Text>

      <Text className={`${captionClass} text-sm mt-2`}>
        {isGreen ? "현재 파란불 남은 시간" : "다음 파란불까지 남은 시간"}
      </Text>

      <View className={`mt-5 border-t pt-3 ${dividerClass}`}>
        <Text className={`${captionClass} text-xs font-semibold`}>
          다음 3회 파란불 남은 시간
        </Text>
        <View className={`mt-2 border-t ${dividerClass}`}>
          {signal.upcomingGreens.map((slot, index) => (
            <ForecastRow
              key={`${signal.crosswalkType}-${index}-${slot.startsAt.toISOString()}`}
              slot={slot}
              index={index}
              accent={isGreen}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function CountdownOverlay() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const signals = CROSSWALK_ORDER.map((crosswalkType) =>
    getPedestrianCountdown(now, crosswalkType),
  );

  return (
    <View className="gap-4">
      {signals.map((signal) => (
        <CrosswalkCard key={signal.crosswalkType} signal={signal} />
      ))}
    </View>
  );
}
