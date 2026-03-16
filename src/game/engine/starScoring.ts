import type { LevelData } from '../models/level';
import type { NeedTimerState } from '../models/need';
import type { LevelWinResult, StarCount } from '../models/scoring';

export function createLevelWinResult(
  level: LevelData,
  needState: NeedTimerState,
): LevelWinResult | null {
  if (!needState.activeNeed) {
    return null;
  }

  return {
    levelId: level.id,
    levelName: level.name,
    stars: calculateStarCount(level, needState.remainingSeconds),
    remainingSeconds: Math.max(needState.remainingSeconds, 0),
    targetId: needState.activeNeed.targetId,
  };
}

export function calculateStarCount(
  level: LevelData,
  remainingSeconds: number,
): StarCount {
  const safeRemainingSeconds = Math.max(remainingSeconds, 0);

  if (safeRemainingSeconds >= level.starRules.threeStar) {
    return 3;
  }

  if (safeRemainingSeconds >= level.starRules.twoStar) {
    return 2;
  }

  return 1;
}
