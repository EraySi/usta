import { WORLD_1_LEVELS } from '../data';
import { createBoard, type GameBoardModel } from '../models/board';
import type { GridPosition, LevelData } from '../models/level';

export type LoadedLevel = {
  level: LevelData;
  board: GameBoardModel;
};

export function getLevelById(levelId: string): LevelData | null {
  return WORLD_1_LEVELS.find((level) => level.id === levelId) ?? null;
}

export function createBoardFromLevel(level: LevelData): GameBoardModel {
  const board = createBoard(level.gridSize);

  for (const row of board) {
    for (const cell of row) {
      const position = { row: cell.row, column: cell.column };

      if (matchesPosition(level.source, position)) {
        cell.cellType = 'source';
        cell.endpointDirection = level.source.direction;
        continue;
      }

      const matchingTarget = level.targets.find((target) =>
        matchesPosition(target, position),
      );

      if (matchingTarget) {
        cell.cellType = 'target';
        cell.endpointDirection = matchingTarget.direction;
        cell.targetId = matchingTarget.id;
        continue;
      }

      if (level.blockedCells.some((blockedCell) => matchesPosition(blockedCell, position))) {
        cell.cellType = 'blocked';
      }
    }
  }

  return board;
}

export function loadLevel(levelId: string): LoadedLevel | null {
  const level = getLevelById(levelId);

  if (!level) {
    return null;
  }

  return {
    level,
    board: createBoardFromLevel(level),
  };
}

function matchesPosition(
  first: GridPosition,
  second: GridPosition,
): boolean {
  return first.row === second.row && first.column === second.column;
}
