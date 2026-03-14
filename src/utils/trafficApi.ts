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
 * - 새벽 시간대: 평균 140초 사이클 (02:34:26 시작 기준)
 * - 토요일 낮 시간대 (12시 이후): 180초 사이클 (14:44:04 시작 기준)
 *
 * B를 사이클의 시작점(0초)으로 간주합니다:
 * - 0 ~ 20초: B 횡단보도 초록불
 * - 그 외: B 횡단보도 빨간불
 */
export const getVirtualSignalStatus = (
  crosswalkType: "A" | "B" = "A",
  customTimeSeconds?: number,
): SignalStatus => {
  const nowUnixSeconds = customTimeSeconds ?? Math.floor(Date.now() / 1000);

  // 현재 시간에 맞춰서 요일과 시간 구하기
  const now = new Date(nowUnixSeconds * 1000);
  const day = now.getDay(); // 0(일) ~ 6(토)
  const hours = now.getHours();

  // 토요일 오후 12시(정오) 이후인지 판별
  const isSaturdayAfternoon = day === 6 && hours >= 12;

  let CYCLE_LENGTH: number;
  let BASE_TIME_MS: number;
  let aGreenStart: number;
  let aGreenEnd: number;

  if (isSaturdayAfternoon) {
    // 토요일 낮 시간대 (앱이 2초 느리다는 피드백 반영: 14:44:02로 수정하여 2초 앞당김)
    CYCLE_LENGTH = 180; // 3분
    BASE_TIME_MS = new Date("2026-03-14T14:44:02+09:00").getTime();
    aGreenStart = 156;
    aGreenEnd = 180;
  } else {
    // 새벽 시간대 및 평시
    CYCLE_LENGTH = 140;
    BASE_TIME_MS = new Date("2026-03-14T02:34:26+09:00").getTime();
    aGreenStart = 116;
    aGreenEnd = 140;
  }

  const baseTimeSeconds = Math.floor(BASE_TIME_MS / 1000);

  let diff = nowUnixSeconds - baseTimeSeconds;
  if (diff < 0) {
    diff = (diff % CYCLE_LENGTH) + CYCLE_LENGTH;
  }
  const cyclePosition = diff % CYCLE_LENGTH;

  if (crosswalkType === "A") {
    if (cyclePosition >= aGreenStart && cyclePosition < aGreenEnd) {
      return {
        isGreen: true,
        timeRemaining: aGreenEnd - cyclePosition,
      };
    } else {
      return {
        isGreen: false,
        timeRemaining: aGreenStart - cyclePosition,
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
        timeRemaining: CYCLE_LENGTH - cyclePosition,
      };
    }
  }
};
