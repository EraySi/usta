import type { PipeModel } from './pipes';

export const BOARD_SIZE = 6;

export type BoardCellModel = {
  id: string;
  row: number;
  column: number;
  pipe: PipeModel | null;
};

export type GameBoardModel = BoardCellModel[][];

const INITIAL_PIPES: Array<{
  row: number;
  column: number;
  pipe: PipeModel;
}> = [
  { row: 1, column: 1, pipe: { type: 'straight', orientation: 'horizontal' } },
  { row: 2, column: 3, pipe: { type: 'corner', orientation: 'right-down' } },
  { row: 4, column: 2, pipe: { type: 'tee', orientation: 'up-right-down' } },
];

export function createInitialBoard(size: number = BOARD_SIZE): GameBoardModel {
  const board = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => ({
      id: `${row}-${column}`,
      row,
      column,
      pipe: null,
    })),
  );

  INITIAL_PIPES.forEach(({ row, column, pipe }) => {
    if (row < size && column < size) {
      board[row][column] = {
        ...board[row][column],
        pipe,
      };
    }
  });

  return board;
}
