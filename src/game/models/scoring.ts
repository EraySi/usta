export type StarCount = 1 | 2 | 3;

export type LevelWinResult = {
  levelId: string;
  levelName: string;
  stars: StarCount;
  remainingSeconds: number;
  targetId: string;
};
