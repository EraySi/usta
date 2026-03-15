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

  if (!sourceCell?.pipe || !targetCell?.pipe) {
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

export function getConnectedNeighborPositions(
  board: GameBoardModel,
  position: BoardPosition,
): BoardPosition[] {
  const cell = getBoardCell(board, position);

  if (!cell?.pipe) {
    return [];
  }

  const connectedNeighbors: BoardPosition[] = [];

  for (const direction of getPipeConnections(cell.pipe)) {
    const neighborPosition = movePosition(position, direction);
    const neighborCell = getBoardCell(board, neighborPosition);

    if (!neighborCell?.pipe) {
      continue;
    }

    if (areAdjacentPipeCellsConnected(cell, neighborCell)) {
      connectedNeighbors.push(neighborPosition);
    }
  }

  return connectedNeighbors;
}

export function areAdjacentPipeCellsConnected(
  firstCell: BoardCellModel,
  secondCell: BoardCellModel,
): boolean {
  if (!firstCell.pipe || !secondCell.pipe) {
    return false;
  }

  const direction = getDirectionBetweenPositions(firstCell, secondCell);

  if (!direction) {
    return false;
  }

  const firstConnections = getPipeConnections(firstCell.pipe);
  const secondConnections = getPipeConnections(secondCell.pipe);

  return (
    firstConnections.includes(direction) &&
    secondConnections.includes(getOppositeDirection(direction))
  );
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
