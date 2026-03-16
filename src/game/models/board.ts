import type { Direction, PipeModel } from './pipes';

export const BOARD_SIZE = 6;

export type BoardCellType = 'empty' | 'blocked' | 'source' | 'target';

export type BoardCellModel = {
  id: string;
  row: number;
  column: number;
  pipe: PipeModel | null;
  cellType: BoardCellType;
  endpointDirection: Direction | null;
  targetId: string | null;
};

export type GameBoardModel = BoardCellModel[][];

export function createBoard(size: number = BOARD_SIZE): GameBoardModel {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => ({
      id: `${row}-${column}`,
      row,
      column,
      pipe: null,
      cellType: 'empty',
      endpointDirection: null,
      targetId: null,
    })),
  );
}
