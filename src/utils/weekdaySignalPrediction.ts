export type StableSplit = {
  phase1: number;
  phase2: number;
  phase3: number;
  phase4: number;
};

export type StableAnchorStatus = "confirmed" | "observed" | "assumed";
export type CrosswalkType = "A" | "B";

export type SignalPrediction =
  | {
      status: "stable";
      cycleLengthSec: number;
      phase1Start: Date;
      phase2Start: Date;
      nextPedestrianGreenAt: Date;
      secondsUntilNextPedestrianGreen: number;
      segmentLabel: string;
      split: StableSplit;
      anchorStatus: StableAnchorStatus;
      cycleOffsetSec: number;
    }
  | {
      status: "transition";
      segmentLabel: string;
      transitionFromCycleSec: number | null;
      transitionToCycleSec: number | null;
      message: string;
    };

export type PedestrianCountdown =
  | {
      status: "stable";
      crosswalkType: CrosswalkType;
      isGreen: boolean;
      timeRemainingSec: number;
      nextGreenAt: Date;
      segmentLabel: string;
      cycleLengthSec: number;
      anchorStatus: StableAnchorStatus;
      currentWindowStart: Date;
      currentWindowEnd: Date;
      upcomingGreens: UpcomingGreenSlot[];
    }
  | {
      status: "transition";
      crosswalkType: CrosswalkType;
      segmentLabel: string;
      message: string;
    };

export type UpcomingGreenSlot = {
  startsAt: Date;
  secondsUntilStart: number;
  isCurrent: boolean;
};

export type WeekdayStableSegment = {
  segmentLabel: string;
  transitionStartTime: string;
  stableAnchorTime: string;
  validUntilTime: string;
  cycleLengthSec: number;
  split: StableSplit;
  anchorStatus: StableAnchorStatus;
  notes: string;
};

type TransitionWindow = {
  segmentLabel: string;
  startSec: number;
  endSec: number;
  transitionFromCycleSec: number | null;
  transitionToCycleSec: number | null;
  message: string;
};

type PhaseTarget = 2 | 4;

const PHASE_2_PEDESTRIAN_DELAY_SEC = 2;
const PHASE_2_PEDESTRIAN_GREEN_SEC = 20;
const PHASE_4_PEDESTRIAN_GREEN_SEC = 24;

// Confirmed stable split interpretation based on field observation, not raw ID table variants.
export const stableSplits = {
  stable140: { phase1: 10, phase2: 74, phase3: 32, phase4: 24 },
  stable160Id8: { phase1: 10, phase2: 89, phase3: 37, phase4: 24 },
  stable160Id9: { phase1: 22, phase2: 81, phase3: 33, phase4: 24 },
  stable180Id14: { phase1: 10, phase2: 108, phase3: 38, phase4: 24 },
  stable180Id15: { phase1: 22, phase2: 101, phase3: 33, phase4: 24 },
} satisfies Record<string, StableSplit>;

// Weekday-only stable anchors for the first implementation.
// The transition windows are intentionally treated as "unpredictable" until modeled separately.
export const weekdaySegments: WeekdayStableSegment[] = [
  {
    segmentLabel: "06:30-09:30 stable 180",
    transitionStartTime: "06:30:00",
    stableAnchorTime: "06:40:50",
    validUntilTime: "09:30:00",
    cycleLengthSec: 180,
    split: stableSplits.stable180Id14,
    anchorStatus: "assumed",
    notes: "06:30 전환 후 ID 14 기준 정상 180초 주기 시작 후보값",
  },
  {
    segmentLabel: "09:30-16:00 stable 160",
    transitionStartTime: "09:30:00",
    stableAnchorTime: "09:39:20",
    validUntilTime: "16:00:00",
    cycleLengthSec: 160,
    split: stableSplits.stable160Id8,
    anchorStatus: "observed",
    notes: "관측 기반 정리값, ID 8 split 적용",
  },
  {
    segmentLabel: "16:00-20:00 stable 180",
    transitionStartTime: "16:00:00",
    stableAnchorTime: "16:10:38",
    validUntilTime: "20:00:00",
    cycleLengthSec: 180,
    split: stableSplits.stable180Id15,
    anchorStatus: "assumed",
    notes: "16:00 전환 후 ID 15 기준 정상 180초 주기 시작 가정값",
  },
  {
    segmentLabel: "20:00-23:00 stable 160",
    transitionStartTime: "20:00:00",
    stableAnchorTime: "20:11:30",
    validUntilTime: "23:00:00",
    cycleLengthSec: 160,
    split: stableSplits.stable160Id9,
    anchorStatus: "observed",
    notes: "실측 기반, ID 9 split 적용",
  },
  {
    segmentLabel: "23:00-24:00 stable 140",
    transitionStartTime: "23:00:00",
    stableAnchorTime: "23:10:54",
    validUntilTime: "24:00:00",
    cycleLengthSec: 140,
    split: stableSplits.stable140,
    anchorStatus: "observed",
    notes: "실측 기반",
  },
];

const weekdayTransitionWindows: TransitionWindow[] = [
  {
    segmentLabel: "06:30 transition",
    startSec: toSeconds("06:30:00"),
    endSec: toSeconds("06:40:50"),
    transitionFromCycleSec: 140,
    transitionToCycleSec: 180,
    message:
      "06:30 전환 후 정상 180초 주기가 안정화되기 전 구간입니다. 현재는 정확 예측을 지원하지 않습니다.",
  },
  {
    segmentLabel: "09:30 transition",
    startSec: toSeconds("09:30:00"),
    endSec: toSeconds("09:39:20"),
    transitionFromCycleSec: 180,
    transitionToCycleSec: 160,
    message:
      "09:30 전환 후 정상 160초 주기가 안정화되기 전 구간입니다. 현재는 정확 예측을 지원하지 않습니다.",
  },
  {
    segmentLabel: "16:00 transition",
    startSec: toSeconds("16:00:00"),
    endSec: toSeconds("16:10:38"),
    transitionFromCycleSec: 160,
    transitionToCycleSec: 180,
    message:
      "16:00 전환 후 정상 180초 주기가 안정화되기 전 구간입니다. 현재는 정확 예측을 지원하지 않습니다.",
  },
  {
    segmentLabel: "20:00 transition",
    startSec: toSeconds("20:00:00"),
    endSec: toSeconds("20:11:31"),
    transitionFromCycleSec: 180,
    transitionToCycleSec: 160,
    message:
      "20:00 전환 후 정상 160초 주기가 안정화되기 전 구간입니다. 현재는 정확 예측을 지원하지 않습니다.",
  },
  {
    segmentLabel: "23:00 transition",
    startSec: toSeconds("23:00:00"),
    endSec: toSeconds("23:10:54"),
    transitionFromCycleSec: 160,
    transitionToCycleSec: 140,
    message:
      "23:00 전환 후 정상 140초 주기가 안정화되기 전 구간입니다. 현재는 정확 예측을 지원하지 않습니다.",
  },
];

export function toSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function getDateAtSeconds(baseDate: Date, secondsOfDay: number): Date {
  const result = new Date(baseDate);
  result.setHours(0, 0, 0, 0);
  result.setSeconds(secondsOfDay);
  return result;
}

export function getSecondsIntoDay(now: Date): number {
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

function getStableStartSec(segment: WeekdayStableSegment): number {
  return toSeconds(segment.stableAnchorTime);
}

function getNominalTransitionSec(segment: WeekdayStableSegment): number {
  return toSeconds(segment.validUntilTime);
}

function getLastPhase1StartBeforeTransition(
  segment: WeekdayStableSegment,
): number {
  const stableStartSec = getStableStartSec(segment);
  const transitionSec = getNominalTransitionSec(segment);
  const cyclesElapsed = Math.floor(
    (transitionSec - stableStartSec - 1) / segment.cycleLengthSec,
  );

  return stableStartSec + cyclesElapsed * segment.cycleLengthSec;
}

function getLastPhase4EndBeforeTransition(
  segment: WeekdayStableSegment,
): number {
  return getLastPhase1StartBeforeTransition(segment) + segment.cycleLengthSec;
}

function getStableEndSec(segment: WeekdayStableSegment): number {
  const segmentIndex = weekdaySegments.findIndex(
    (candidate) => candidate.segmentLabel === segment.segmentLabel,
  );

  if (segmentIndex < 0 || segmentIndex === weekdaySegments.length - 1) {
    return toSeconds(segment.validUntilTime);
  }

  return getLastPhase4EndBeforeTransition(segment);
}

function getDerivedTransitionWindows(): TransitionWindow[] {
  const derivedWindows: TransitionWindow[] = [weekdayTransitionWindows[0]];

  for (let index = 1; index < weekdaySegments.length; index += 1) {
    const previousSegment = weekdaySegments[index - 1];
    const currentSegment = weekdaySegments[index];
    const transitionStartSec = getStableEndSec(previousSegment);
    const transitionEndSec = toSeconds(currentSegment.stableAnchorTime);

    derivedWindows.push({
      segmentLabel: `${currentSegment.transitionStartTime.slice(0, 5)} transition`,
      startSec: transitionStartSec,
      endSec: transitionEndSec,
      transitionFromCycleSec: previousSegment.cycleLengthSec,
      transitionToCycleSec: currentSegment.cycleLengthSec,
      message: `${currentSegment.transitionStartTime.slice(0, 5)} 전환 이후 마지막 4현시 종료부터 정상 ${currentSegment.cycleLengthSec}초 주기 anchor까지는 현재 측정불가 구간입니다.`,
    });
  }

  return derivedWindows;
}

const resolvedWeekdayTransitionWindows = getDerivedTransitionWindows();

function getCurrentTransitionWindow(now: Date): TransitionWindow | null {
  const secondsIntoDay = getSecondsIntoDay(now);

  if (secondsIntoDay < toSeconds("06:30:00")) {
    return {
      segmentLabel: "before-06:30 out of scope",
      startSec: 0,
      endSec: toSeconds("06:30:00"),
      transitionFromCycleSec: null,
      transitionToCycleSec: 180,
      message:
        "06:30 이전 평일 구간은 현재 1차 구현 범위 밖입니다. 추후 야간 stable/transition 모델을 추가해야 합니다.",
    };
  }

  return (
    resolvedWeekdayTransitionWindows.find(
      (window) =>
        secondsIntoDay >= window.startSec && secondsIntoDay < window.endSec,
    ) ?? null
  );
}

export function isTransitionWindow(now: Date): boolean {
  return getCurrentTransitionWindow(now) !== null;
}

export function getCurrentStableSegment(
  now: Date,
): WeekdayStableSegment | null {
  if (isTransitionWindow(now)) {
    return null;
  }

  const secondsIntoDay = getSecondsIntoDay(now);

  return (
    weekdaySegments.find((segment) => {
      const stableStartSec = getStableStartSec(segment);
      const validUntilSec = getStableEndSec(segment);

      return secondsIntoDay >= stableStartSec && secondsIntoDay < validUntilSec;
    }) ?? null
  );
}

function getCycleOffsetSec(
  now: Date,
  stableAnchor: Date,
  cycleLengthSec: number,
): number {
  const diffSec = Math.floor((now.getTime() - stableAnchor.getTime()) / 1000);
  return ((diffSec % cycleLengthSec) + cycleLengthSec) % cycleLengthSec;
}

export function getNextPhase2Start(
  now: Date,
  stableAnchor: Date,
  cycleLengthSec: number,
  split: StableSplit,
): Date {
  const cycleOffsetSec = getCycleOffsetSec(now, stableAnchor, cycleLengthSec);
  const phase1Start = new Date(now.getTime() - cycleOffsetSec * 1000);
  const candidate = new Date(phase1Start.getTime() + split.phase1 * 1000);

  if (candidate.getTime() >= now.getTime()) {
    return candidate;
  }

  return new Date(candidate.getTime() + cycleLengthSec * 1000);
}

function getNextPhaseStart(
  now: Date,
  stableAnchor: Date,
  cycleLengthSec: number,
  split: StableSplit,
  phase: PhaseTarget,
): Date {
  const cycleOffsetSec = getCycleOffsetSec(now, stableAnchor, cycleLengthSec);
  const phase1Start = new Date(now.getTime() - cycleOffsetSec * 1000);
  const offsetSec =
    phase === 2 ? split.phase1 : split.phase1 + split.phase2 + split.phase3;
  const candidate = new Date(phase1Start.getTime() + offsetSec * 1000);

  if (candidate.getTime() >= now.getTime()) {
    return candidate;
  }

  return new Date(candidate.getTime() + cycleLengthSec * 1000);
}

function getNextPedestrianGreenForPhase(
  now: Date,
  phase: PhaseTarget,
): Date | null {
  const segment = getCurrentStableSegment(now);

  if (!segment) {
    return null;
  }

  const stableAnchor = getDateAtSeconds(
    now,
    toSeconds(segment.stableAnchorTime),
  );
  const phaseStart = getNextPhaseStart(
    now,
    stableAnchor,
    segment.cycleLengthSec,
    segment.split,
    phase,
  );

  if (phase === 2) {
    return new Date(phaseStart.getTime() + PHASE_2_PEDESTRIAN_DELAY_SEC * 1000);
  }

  return phaseStart;
}

export function getNextPedestrianGreenForPhase2(now: Date): Date | null {
  return getNextPedestrianGreenForPhase(now, 2);
}

export function getNextPedestrianGreenForPhase4(now: Date): Date | null {
  return getNextPedestrianGreenForPhase(now, 4);
}

function getCurrentCyclePhase1Start(
  now: Date,
  stableAnchor: Date,
  cycleLengthSec: number,
): Date {
  const cycleOffsetSec = getCycleOffsetSec(now, stableAnchor, cycleLengthSec);
  return new Date(now.getTime() - cycleOffsetSec * 1000);
}

function getPedestrianWindowForCycle(
  phase1Start: Date,
  split: StableSplit,
  crosswalkType: CrosswalkType,
): { start: Date; end: Date } {
  const startOffsetSec =
    crosswalkType === "B"
      ? split.phase1 + PHASE_2_PEDESTRIAN_DELAY_SEC
      : split.phase1 + split.phase2 + split.phase3;
  const greenDurationSec =
    crosswalkType === "B"
      ? PHASE_2_PEDESTRIAN_GREEN_SEC
      : PHASE_4_PEDESTRIAN_GREEN_SEC;
  const start = new Date(phase1Start.getTime() + startOffsetSec * 1000);

  return {
    start,
    end: new Date(start.getTime() + greenDurationSec * 1000),
  };
}

function getUpcomingGreenSlots(
  now: Date,
  phase1Start: Date,
  cycleLengthSec: number,
  split: StableSplit,
  crosswalkType: CrosswalkType,
  count: number,
): UpcomingGreenSlot[] {
  const slots: UpcomingGreenSlot[] = [];
  let cursorPhase1Start = phase1Start;

  while (slots.length < count) {
    const window = getPedestrianWindowForCycle(
      cursorPhase1Start,
      split,
      crosswalkType,
    );

    if (now.getTime() < window.end.getTime()) {
      slots.push({
        startsAt: window.start,
        secondsUntilStart: Math.max(
          0,
          Math.floor((window.start.getTime() - now.getTime()) / 1000),
        ),
        isCurrent: now.getTime() >= window.start.getTime(),
      });
    }

    cursorPhase1Start = new Date(
      cursorPhase1Start.getTime() + cycleLengthSec * 1000,
    );
  }

  return slots;
}

export function getPedestrianCountdown(
  now: Date,
  crosswalkType: CrosswalkType,
): PedestrianCountdown {
  const prediction = getWeekdaySignalState(now);

  if (prediction.status === "transition") {
    return {
      status: "transition",
      crosswalkType,
      segmentLabel: prediction.segmentLabel,
      message: prediction.message,
    };
  }

  const stableAnchor = getDateAtSeconds(
    now,
    toSeconds(
      weekdaySegments.find(
        (segment) => segment.segmentLabel === prediction.segmentLabel,
      )!.stableAnchorTime,
    ),
  );
  const phase1Start = getCurrentCyclePhase1Start(
    now,
    stableAnchor,
    prediction.cycleLengthSec,
  );
  const currentWindow = getPedestrianWindowForCycle(
    phase1Start,
    prediction.split,
    crosswalkType,
  );
  const upcomingGreens = getUpcomingGreenSlots(
    now,
    phase1Start,
    prediction.cycleLengthSec,
    prediction.split,
    crosswalkType,
    3,
  );

  if (now.getTime() < currentWindow.start.getTime()) {
    return {
      status: "stable",
      crosswalkType,
      isGreen: false,
      timeRemainingSec: Math.floor(
        (currentWindow.start.getTime() - now.getTime()) / 1000,
      ),
      nextGreenAt: currentWindow.start,
      segmentLabel: prediction.segmentLabel,
      cycleLengthSec: prediction.cycleLengthSec,
      anchorStatus: prediction.anchorStatus,
      currentWindowStart: currentWindow.start,
      currentWindowEnd: currentWindow.end,
      upcomingGreens,
    };
  }

  if (now.getTime() < currentWindow.end.getTime()) {
    return {
      status: "stable",
      crosswalkType,
      isGreen: true,
      timeRemainingSec: Math.floor(
        (currentWindow.end.getTime() - now.getTime()) / 1000,
      ),
      nextGreenAt: currentWindow.start,
      segmentLabel: prediction.segmentLabel,
      cycleLengthSec: prediction.cycleLengthSec,
      anchorStatus: prediction.anchorStatus,
      currentWindowStart: currentWindow.start,
      currentWindowEnd: currentWindow.end,
      upcomingGreens,
    };
  }

  const nextCyclePhase1Start = new Date(
    phase1Start.getTime() + prediction.cycleLengthSec * 1000,
  );
  const nextWindow = getPedestrianWindowForCycle(
    nextCyclePhase1Start,
    prediction.split,
    crosswalkType,
  );

  return {
    status: "stable",
    crosswalkType,
    isGreen: false,
    timeRemainingSec: Math.floor(
      (nextWindow.start.getTime() - now.getTime()) / 1000,
    ),
    nextGreenAt: nextWindow.start,
    segmentLabel: prediction.segmentLabel,
    cycleLengthSec: prediction.cycleLengthSec,
    anchorStatus: prediction.anchorStatus,
    currentWindowStart: nextWindow.start,
    currentWindowEnd: nextWindow.end,
    upcomingGreens,
  };
}

export function getWeekdaySignalState(now: Date): SignalPrediction {
  const transitionWindow = getCurrentTransitionWindow(now);

  if (transitionWindow) {
    return {
      status: "transition",
      segmentLabel: transitionWindow.segmentLabel,
      transitionFromCycleSec: transitionWindow.transitionFromCycleSec,
      transitionToCycleSec: transitionWindow.transitionToCycleSec,
      message: transitionWindow.message,
    };
  }

  const segment = getCurrentStableSegment(now);

  if (!segment) {
    return {
      status: "transition",
      segmentLabel: "weekday stable segment unavailable",
      transitionFromCycleSec: null,
      transitionToCycleSec: null,
      message:
        "현재 시각에 해당하는 평일 stable 구간을 찾지 못했습니다. 데이터 구조를 확인하세요.",
    };
  }

  const stableAnchor = getDateAtSeconds(
    now,
    toSeconds(segment.stableAnchorTime),
  );
  const cycleOffsetSec = getCycleOffsetSec(
    now,
    stableAnchor,
    segment.cycleLengthSec,
  );
  const phase1Start = new Date(now.getTime() - cycleOffsetSec * 1000);
  const phase2Start = getNextPhase2Start(
    now,
    stableAnchor,
    segment.cycleLengthSec,
    segment.split,
  );
  const nextPedestrianGreenAt = new Date(
    phase2Start.getTime() + PHASE_2_PEDESTRIAN_DELAY_SEC * 1000,
  );

  return {
    status: "stable",
    cycleLengthSec: segment.cycleLengthSec,
    phase1Start,
    phase2Start,
    nextPedestrianGreenAt,
    secondsUntilNextPedestrianGreen: Math.max(
      0,
      Math.floor((nextPedestrianGreenAt.getTime() - now.getTime()) / 1000),
    ),
    segmentLabel: segment.segmentLabel,
    split: segment.split,
    anchorStatus: segment.anchorStatus,
    cycleOffsetSec,
  };
}

export function runWeekdaySignalPredictionSamples(): void {
  const sampleTimes = ["09:30:30", "09:45:00", "20:05:00", "20:20:00"];

  sampleTimes.forEach((time) => {
    const sampleDate = getDateAtSeconds(
      new Date("2026-03-19T00:00:00+09:00"),
      toSeconds(time),
    );
    const prediction = getWeekdaySignalState(sampleDate);

    if (prediction.status === "stable") {
      console.log(
        [
          time,
          prediction.segmentLabel,
          `cycle=${prediction.cycleLengthSec}s`,
          `phase1Start=${prediction.phase1Start.toTimeString().slice(0, 8)}`,
          `phase2Start=${prediction.phase2Start.toTimeString().slice(0, 8)}`,
          `pedAt=${prediction.nextPedestrianGreenAt
            .toTimeString()
            .slice(0, 8)}`,
          `wait=${prediction.secondsUntilNextPedestrianGreen}s`,
        ].join(" | "),
      );
    } else {
      console.log(
        [
          time,
          prediction.segmentLabel,
          `from=${prediction.transitionFromCycleSec ?? "?"}`,
          `to=${prediction.transitionToCycleSec ?? "?"}`,
          prediction.message,
        ].join(" | "),
      );
    }
  });
}
