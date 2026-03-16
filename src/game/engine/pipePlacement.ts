import type { BoardCellModel, GameBoardModel } from '../models/board';
import type { AvailablePiece } from '../models/level';
import {
  createDefaultPipe,
  rotatePipe,
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

export function canRotatePipeInCell(cell: BoardCellModel): boolean {
  return cell.cellType === 'empty' && Boolean(cell.pipe);
}

export function canMovePipeFromCell(cell: BoardCellModel): boolean {
  return cell.cellType === 'empty' && Boolean(cell.pipe);
}

export function canMovePipeToCell(cell: BoardCellModel): boolean {
  return canPlacePipeInCell(cell);
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

export function rotatePipeOnBoard(
  board: GameBoardModel,
  position: BoardPosition,
): GameBoardModel {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.row !== position.row || cell.column !== position.column) {
        return cell;
      }

      if (!canRotatePipeInCell(cell) || !cell.pipe) {
        return cell;
      }

      return {
        ...cell,
        pipe: rotatePipe(cell.pipe),
      };
    }),
  );
}

export function movePipeOnBoard(
  board: GameBoardModel,
  from: BoardPosition,
  to: BoardPosition,
): GameBoardModel {
  const fromCell = board[from.row]?.[from.column];
  const toCell = board[to.row]?.[to.column];

  if (!fromCell?.pipe || !canMovePipeFromCell(fromCell) || !toCell || !canMovePipeToCell(toCell)) {
    return board;
  }

  if (from.row === to.row && from.column === to.column) {
    return board;
  }

  const movingPipe = fromCell.pipe;

  return board.map((row) =>
    row.map((cell) => {
      if (cell.row === from.row && cell.column === from.column) {
        return {
          ...cell,
          pipe: null,
        };
      }

      if (cell.row === to.row && cell.column === to.column) {
        return {
          ...cell,
          pipe: movingPipe,
        };
      }

      return cell;
    }),
  );
}

export function removePipeFromBoard(
  board: GameBoardModel,
  position: BoardPosition,
): GameBoardModel {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.row !== position.row || cell.column !== position.column) {
        return cell;
      }

      if (!cell.pipe || !canMovePipeFromCell(cell)) {
        return cell;
      }

      return {
        ...cell,
        pipe: null,
      };
    }),
  );
}

export function restoreAvailablePiece(
  availablePieces: AvailablePiece[],
  pipeType: PipeType,
): AvailablePiece[] {
  return availablePieces.map((piece) =>
    piece.type === pipeType
      ? { ...piece, count: piece.count + 1 }
      : piece,
  );
}

export function getAvailablePiecesForBoard(
  baseAvailablePieces: AvailablePiece[],
  board: GameBoardModel | null,
): AvailablePiece[] {
  if (!board) {
    return baseAvailablePieces.map((piece) => ({ ...piece }));
  }

  const placedCounts: Record<PipeType, number> = {
    straight: 0,
    corner: 0,
    tee: 0,
  };

  for (const row of board) {
    for (const cell of row) {
      if (cell.pipe) {
        placedCounts[cell.pipe.type] += 1;
      }
    }
  }

  return baseAvailablePieces.map((piece) => ({
    ...piece,
    count: Math.max(piece.count - placedCounts[piece.type], 0),
  }));
}
