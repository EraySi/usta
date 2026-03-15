export const BOARD_SIZE = 6;

export type PipeType = null;

export type BoardCellModel = {
  id: string;
  row: number;
  column: number;
  pipeType: PipeType;
};

export type GameBoardModel = BoardCellModel[][];

export function createInitialBoard(size: number = BOARD_SIZE): GameBoardModel {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => ({
      id: `${row}-${column}`,
      row,
      column,
      pipeType: null,
    })),
  );
}
