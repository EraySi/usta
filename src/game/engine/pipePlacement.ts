import type { BoardCellModel, GameBoardModel } from '../models/board';
import type { AvailablePiece } from '../models/level';
import {
  createDefaultPipe,
  type PipeType,
} from '../models/pipes';

type BoardPosition = Pick<BoardCellModel, 'row' | 'column'>;

export function canPlacePipeInCell(cell: BoardCellModel): boolean {
  return cell.cellType === 'empty' && !cell.pipe;
}

export function hasAvailablePiece(
  availablePieces: AvailablePiece[],
  pipeType: PipeType,
): boolean {
  return availablePieces.some(
    (piece) => piece.type === pipeType && piece.count > 0,
  );
}

export function getFirstAvailablePipeType(
  availablePieces: AvailablePiece[],
): PipeType | null {
  return availablePieces.find((piece) => piece.count > 0)?.type ?? null;
}

export function placePipeOnBoard(
  board: GameBoardModel,
  position: BoardPosition,
  pipeType: PipeType,
): GameBoardModel {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.row !== position.row || cell.column !== position.column) {
        return cell;
      }

      if (!canPlacePipeInCell(cell)) {
        return cell;
      }

      return {
        ...cell,
        pipe: createDefaultPipe(pipeType),
      };
    }),
  );
}

export function consumeAvailablePiece(
  availablePieces: AvailablePiece[],
  pipeType: PipeType,
): AvailablePiece[] {
  return availablePieces.map((piece) =>
    piece.type === pipeType
      ? { ...piece, count: Math.max(piece.count - 1, 0) }
      : piece,
  );
}
