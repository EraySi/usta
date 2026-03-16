import type { NeedTimerState } from '../models/need';
import type { LevelData } from '../models/level';

export function createNeedTimerState(level: LevelData): NeedTimerState {
  const activeNeed = level.needSequence[0] ?? null;

  return {
    activeNeed,
    remainingSeconds: activeNeed?.durationSeconds ?? 0,
    isExpired: false,
  };
}

export function tickNeedTimerState(state: NeedTimerState): NeedTimerState {
  if (!state.activeNeed || state.remainingSeconds <= 0) {
    return {
      ...state,
      remainingSeconds: Math.max(state.remainingSeconds, 0),
      isExpired: Boolean(state.activeNeed),
    };
  }

  const remainingSeconds = Math.max(state.remainingSeconds - 1, 0);

  return {
    ...state,
    remainingSeconds,
    isExpired: remainingSeconds === 0,
  };
}
