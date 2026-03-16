import type { LevelNeed } from './need';
import type { Direction, PipeType } from './pipes';

export type GridPosition = {
  row: number;
  column: number;
};

export type LevelEndpoint = GridPosition & {
  direction: Direction;
};

export type LevelTarget = LevelEndpoint & {
  id: string;
};

export type AvailablePiece = {
  type: PipeType;
  count: number;
};

export type LevelStarRules = {
  oneStar: number;
  twoStar: number;
  threeStar: number;
};

export type LevelData = {
  id: string;
  world: number;
  name: string;
  gridSize: number;
  source: LevelEndpoint;
  targets: LevelTarget[];
  blockedCells: GridPosition[];
  availablePieces: AvailablePiece[];
  needSequence: LevelNeed[];
  starRules: LevelStarRules;
};
