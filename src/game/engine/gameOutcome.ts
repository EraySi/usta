import type { GameBoardModel } from '../models/board';
import type { NeedTimerState } from '../models/need';
import { hasPathFromSourceToTarget } from './pathValidation';

export type GameOutcome = 'win' | 'lose' | null;

export function getGameOutcome(
  board: GameBoardModel | null,
  needState: NeedTimerState | null,
): GameOutcome {
  if (!board || !needState?.activeNeed) {
    return null;
  }

  if (needState.isExpired || needState.remainingSeconds <= 0) {
    return 'lose';
  }

  if (hasPathFromSourceToTarget(board, needState.activeNeed.targetId)) {
    return 'win';
  }

  return null;
}
