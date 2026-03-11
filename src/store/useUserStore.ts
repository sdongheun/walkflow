import { create } from "zustand";

interface UserState {
  walkingSpeed: number; // m/s
  isHealthAppLinked: boolean;
  setWalkingSpeed: (speed: number) => void;
  setHealthAppLinked: (linked: boolean) => void;
  resetToDefault: () => void;
}

const DEFAULT_WALKING_SPEED = 1.2; // 성인 평균 보행 속도 (m/s)

export const useUserStore = create<UserState>((set) => ({
  walkingSpeed: DEFAULT_WALKING_SPEED,
  isHealthAppLinked: false,

  setWalkingSpeed: (speed: number) => set({ walkingSpeed: speed }),
  setHealthAppLinked: (linked: boolean) => set({ isHealthAppLinked: linked }),
  resetToDefault: () =>
    set({
      walkingSpeed: DEFAULT_WALKING_SPEED,
      isHealthAppLinked: false,
    }),
}));
