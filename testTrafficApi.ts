import { getVirtualSignalStatus } from "./src/utils/trafficApi";

console.log("=== A 횡단보도 시뮬레이션 ===");
[0, 10, 50, 125, 126, 149].forEach((time) => {
  const status = getVirtualSignalStatus("A", time);
  console.log(`[${time}초] ${status.isGreen ? "초록불" : "빨간불"} - 남은시간/대기시간: ${status.timeRemaining}초`);
});

console.log("\n=== B 횡단보도 시뮬레이션 ===");
[0, 9, 10, 29, 30, 100, 149].forEach((time) => {
  const status = getVirtualSignalStatus("B", time);
  console.log(`[${time}초] ${status.isGreen ? "초록불" : "빨간불"} - 남은시간/대기시간: ${status.timeRemaining}초`);
});
