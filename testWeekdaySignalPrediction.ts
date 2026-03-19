import {
  getDateAtSeconds,
  getNextPedestrianGreenForPhase2,
  getWeekdaySignalState,
  runWeekdaySignalPredictionSamples,
  toSeconds,
} from "./src/utils/weekdaySignalPrediction";

function logSingleCase(label: string, time: string) {
  const date = getDateAtSeconds(
    new Date("2026-03-19T00:00:00+09:00"),
    toSeconds(time),
  );
  const prediction = getWeekdaySignalState(date);
  const nextPhase2Ped = getNextPedestrianGreenForPhase2(date);

  console.log(`\n[${label}] ${time}`);

  if (prediction.status === "stable") {
    console.log(
      JSON.stringify(
        {
          status: prediction.status,
          segmentLabel: prediction.segmentLabel,
          cycleLengthSec: prediction.cycleLengthSec,
          phase1Start: prediction.phase1Start.toTimeString().slice(0, 8),
          phase2Start: prediction.phase2Start.toTimeString().slice(0, 8),
          nextPedestrianGreenAt: prediction.nextPedestrianGreenAt
            .toTimeString()
            .slice(0, 8),
          secondsUntilNextPedestrianGreen:
            prediction.secondsUntilNextPedestrianGreen,
          nextPhase2PedDirect: nextPhase2Ped?.toTimeString().slice(0, 8) ?? null,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      JSON.stringify(
        {
          status: prediction.status,
          segmentLabel: prediction.segmentLabel,
          transitionFromCycleSec: prediction.transitionFromCycleSec,
          transitionToCycleSec: prediction.transitionToCycleSec,
          message: prediction.message,
          nextPhase2PedDirect: nextPhase2Ped,
        },
        null,
        2,
      ),
    );
  }
}

runWeekdaySignalPredictionSamples();
logSingleCase("stable-160", "20:20:00");
logSingleCase("transition-20", "20:05:00");
logSingleCase("stable-180", "06:45:00");
