import type { BoardCellModel, GameBoardModel } from '../models/board';
import {
  getOppositeDirection,
  getPipeConnections,
  type Direction,
} from '../models/pipes';

export type BoardPosition = Pick<BoardCellModel, 'row' | 'column'>;

export function hasContinuousPipePath(
  board: GameBoardModel,
  source: BoardPosition,
  target: BoardPosition,
): boolean {
  const sourceCell = getBoardCell(board, source);
  const targetCell = getBoardCell(board, target);

  if (!sourceCell || !targetCell) {
    return false;
  }

  if (!hasCellConnections(sourceCell) || !hasCellConnections(targetCell)) {
    return false;
  }

  if (isSamePosition(source, target)) {
    return true;
  }

  const visited = new Set<string>([toPositionKey(source)]);
  const queue: BoardPosition[] = [source];

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];

    for (const neighbor of getConnectedNeighborPositions(board, current)) {
      const neighborKey = toPositionKey(neighbor);

      if (visited.has(neighborKey)) {
        continue;
      }

      if (isSamePosition(neighbor, target)) {
        return true;
      }

      visited.add(neighborKey);
      queue.push(neighbor);
    }
  }

  return false;
}

export function hasPathFromSourceToTarget(
  board: GameBoardModel,
  targetId: string,
): boolean {
  const sourceCell = findSourceCell(board);
  const targetCell = findTargetCell(board, targetId);

  if (!sourceCell || !targetCell) {
    return false;
  }

  return hasContinuousPipePath(board, sourceCell, targetCell);
}

export function getConnectedNeighborPositions(
  board: GameBoardModel,
  position: BoardPosition,
): BoardPosition[] {
  const cell = getBoardCell(board, position);

  if (!cell || !hasCellConnections(cell)) {
    return [];
  }

  const connectedNeighbors: BoardPosition[] = [];

  for (const direction of getCellConnections(cell)) {
    const neighborPosition = movePosition(position, direction);
    const neighborCell = getBoardCell(board, neighborPosition);

    if (!neighborCell || !hasCellConnections(neighborCell)) {
      continue;
    }

    if (areAdjacentCellsConnected(cell, neighborCell)) {
      connectedNeighbors.push(neighborPosition);
    }
  }

  return connectedNeighbors;
}

export function areAdjacentCellsConnected(
  firstCell: BoardCellModel,
  secondCell: BoardCellModel,
): boolean {
  if (!hasCellConnections(firstCell) || !hasCellConnections(secondCell)) {
    return false;
  }

  const direction = getDirectionBetweenPositions(firstCell, secondCell);

  if (!direction) {
    return false;
  }

  const firstConnections = getCellConnections(firstCell);
  const secondConnections = getCellConnections(secondCell);

  return (
    firstConnections.includes(direction) &&
    secondConnections.includes(getOppositeDirection(direction))
  );
}

export function findSourceCell(board: GameBoardModel): BoardCellModel | null {
  return findBoardCell(board, (cell) => cell.cellType === 'source');
}

export function findTargetCell(
  board: GameBoardModel,
  targetId: string,
): BoardCellModel | null {
  return findBoardCell(
    board,
    (cell) => cell.cellType === 'target' && cell.targetId === targetId,
  );
}

export function getCellConnections(cell: BoardCellModel): readonly Direction[] {
  if (cell.pipe) {
    return getPipeConnections(cell.pipe);
  }

  if (
    (cell.cellType === 'source' || cell.cellType === 'target') &&
    cell.endpointDirection
  ) {
    return [cell.endpointDirection];
  }

  return [];
}

function getBoardCell(
  board: GameBoardModel,
  position: BoardPosition,
): BoardCellModel | null {
  if (!isWithinBounds(board, position)) {
    return null;
  }

  return board[position.row][position.column] ?? null;
}

function findBoardCell(
  board: GameBoardModel,
  predicate: (cell: BoardCellModel) => boolean,
): BoardCellModel | null {
  for (const row of board) {
    for (const cell of row) {
      if (predicate(cell)) {
        return cell;
      }
    }
  }

  return null;
}

function isWithinBounds(
  board: GameBoardModel,
  position: BoardPosition,
): boolean {
  return (
    position.row >= 0 &&
    position.column >= 0 &&
    position.row < board.length &&
    position.column < (board[position.row]?.length ?? 0)
  );
}

function movePosition(
  position: BoardPosition,
  direction: Direction,
): BoardPosition {
  switch (direction) {
    case 'up':
      return { row: position.row - 1, column: position.column };
    case 'right':
      return { row: position.row, column: position.column + 1 };
    case 'down':
      return { row: position.row + 1, column: position.column };
    case 'left':
      return { row: position.row, column: position.column - 1 };
    default:
      return position;
  }
}

function getDirectionBetweenPositions(
  from: BoardPosition,
  to: BoardPosition,
): Direction | null {
  if (from.row === to.row) {
    if (from.column + 1 === to.column) {
      return 'right';
    }

    if (from.column - 1 === to.column) {
      return 'left';
    }
  }

  if (from.column === to.column) {
    if (from.row + 1 === to.row) {
      return 'down';
    }

    if (from.row - 1 === to.row) {
      return 'up';
    }
  }

  return null;
}

function isSamePosition(first: BoardPosition, second: BoardPosition): boolean {
  return first.row === second.row && first.column === second.column;
}

function toPositionKey(position: BoardPosition): string {
  return `${position.row}-${position.column}`;
}

function hasCellConnections(cell: BoardCellModel): boolean {
  return getCellConnections(cell).length > 0;
}
