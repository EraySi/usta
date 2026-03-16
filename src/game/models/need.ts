export type LevelNeed = {
  id: string;
  label: string;
  targetId: string;
  durationSeconds: number;
};

export type NeedTimerState = {
  activeNeed: LevelNeed | null;
  remainingSeconds: number;
  isExpired: boolean;
};
