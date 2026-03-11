import { Alert } from "react-native";
import { useUserStore } from "../store/useUserStore";

// Expo Go 환경 제약으로 인하여 MVP 시연을 위한 가상(Mock) 처리 로직입니다.
// 실제 앱 배포 환경 구축 시에 react-native-health 코드를 되살려 실제 연동합니다.

export const syncHealthData = async () => {
  const { setWalkingSpeed, setHealthAppLinked } = useUserStore.getState();

  // 연동 딜레이 시뮬레이션 (1.5초 대기)
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      // 가상 성공 처리 (1.4m/s 세팅)
      setWalkingSpeed(1.4);
      setHealthAppLinked(true);
      Alert.alert(
        "연동 성공 (임시 모드)",
        "Expo Go 가상(Mock) 데이터 연동되었습니다.\n회원님의 평균 보행 속도(1.4m/s)를 가져왔습니다.",
      );
      resolve();
    }, 1500);
  });
};
