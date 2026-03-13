import crosswalks from "../data/crosswalkData.json";

export interface CrosswalkData {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface SignalStatus {
  isGreen: boolean;
  timeRemaining: number; // 현재 색상의 남은 시간
}

export const getNearestCrosswalk = (
  lat: number,
  lng: number,
): CrosswalkData => {
  // 실제 프로덕션: 거리 계산 알고리즘 사용
  // MVP 테스트: 인제로 266 (id: "160")
  return crosswalks.find((c) => c.id === "160") as CrosswalkData;
};

/**
 * 횡단보도의 실시간 신호 상태를 반환합니다.
 * - 사이클 총 시간 140초
 * - B횡단보도 파란불 20초
 * - B횡단보도 시작 기준일: 2026년 3월 14일 02:34:26 KST
 * 
 * B를 사이클의 시작점(0초)으로 간주합니다:
 * - 0 ~ 20초: B 횡단보도 초록불
 * - 20 ~ 140초: B 횡단보도 빨간불
 * (A 횡단보도는 임의로 사이클 마지막 24초(116~140)를 초록불로 가정)
 */
export const getVirtualSignalStatus = (
  crosswalkType: "A" | "B" = "A",
  customTimeSeconds?: number
): SignalStatus => {
  const CYCLE_LENGTH = 140; // 총 140초

  // 기준 시간: 2026년 3월 14일 02시 34분 26초 (한국시간)
  const BASE_TIME_MS = new Date("2026-03-14T02:34:26+09:00").getTime();
  const baseTimeSeconds = Math.floor(BASE_TIME_MS / 1000);

  const nowUnixSeconds = customTimeSeconds ?? Math.floor(Date.now() / 1000);
  
  let diff = nowUnixSeconds - baseTimeSeconds;
  if (diff < 0) {
    diff = (diff % CYCLE_LENGTH) + CYCLE_LENGTH;
  }
  const cyclePosition = diff % CYCLE_LENGTH;

  if (crosswalkType === "A") {
    if (cyclePosition >= 116 && cyclePosition < 140) {
      return {
        isGreen: true,
        timeRemaining: 140 - cyclePosition, 
      };
    } else {
      return {
        isGreen: false,
        timeRemaining: 116 - cyclePosition, 
      };
    }
  } else {
    // crosswalkType === 'B'
    if (cyclePosition >= 0 && cyclePosition < 20) {
      return {
        isGreen: true,
        timeRemaining: 20 - cyclePosition,
      };
    } else {
      return {
        isGreen: false,
        timeRemaining: 140 - cyclePosition, 
      };
    }
  }
};
