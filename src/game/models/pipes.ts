export const PIPE_TYPES = ['straight', 'corner', 'tee'] as const;
export const DIRECTIONS = ['up', 'right', 'down', 'left'] as const;

export type PipeType = (typeof PIPE_TYPES)[number];
export type Direction = (typeof DIRECTIONS)[number];

export type StraightOrientation = 'horizontal' | 'vertical';
export type CornerOrientation =
  | 'up-right'
  | 'right-down'
  | 'down-left'
  | 'left-up';
export type TeeOrientation =
  | 'up-right-down'
  | 'right-down-left'
  | 'down-left-up'
  | 'left-up-right';

export type StraightPipe = {
  type: 'straight';
  orientation: StraightOrientation;
};

export type CornerPipe = {
  type: 'corner';
  orientation: CornerOrientation;
};

export type TeePipe = {
  type: 'tee';
  orientation: TeeOrientation;
};

export type PipeModel = StraightPipe | CornerPipe | TeePipe;

export function createDefaultPipe(type: PipeType): PipeModel {
  switch (type) {
    case 'straight':
      return { type: 'straight', orientation: 'horizontal' };
    case 'corner':
      return { type: 'corner', orientation: 'up-right' };
    case 'tee':
      return { type: 'tee', orientation: 'up-right-down' };
    default:
      return { type: 'straight', orientation: 'horizontal' };
  }
}

export function rotatePipe(pipe: PipeModel): PipeModel {
  switch (pipe.type) {
    case 'straight':
      return {
        ...pipe,
        orientation:
          pipe.orientation === 'horizontal' ? 'vertical' : 'horizontal',
      };
    case 'corner':
      return {
        ...pipe,
        orientation: getNextCornerOrientation(pipe.orientation),
      };
    case 'tee':
      return {
        ...pipe,
        orientation: getNextTeeOrientation(pipe.orientation),
      };
    default:
      return pipe;
  }
}

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
};

const STRAIGHT_CONNECTIONS: Record<StraightOrientation, readonly Direction[]> = {
  horizontal: ['left', 'right'],
  vertical: ['up', 'down'],
};

const CORNER_CONNECTIONS: Record<CornerOrientation, readonly Direction[]> = {
  'up-right': ['up', 'right'],
  'right-down': ['right', 'down'],
  'down-left': ['down', 'left'],
  'left-up': ['left', 'up'],
};

const TEE_CONNECTIONS: Record<TeeOrientation, readonly Direction[]> = {
  'up-right-down': ['up', 'right', 'down'],
  'right-down-left': ['right', 'down', 'left'],
  'down-left-up': ['down', 'left', 'up'],
  'left-up-right': ['left', 'up', 'right'],
};

export function getOppositeDirection(direction: Direction): Direction {
  return OPPOSITE_DIRECTIONS[direction];
}

export function getPipeConnections(pipe: PipeModel): readonly Direction[] {
  switch (pipe.type) {
    case 'straight':
      return STRAIGHT_CONNECTIONS[pipe.orientation];
    case 'corner':
      return CORNER_CONNECTIONS[pipe.orientation];
    case 'tee':
      return TEE_CONNECTIONS[pipe.orientation];
    default:
      return [];
  }
}

function getNextCornerOrientation(
  orientation: CornerOrientation,
): CornerOrientation {
  switch (orientation) {
    case 'up-right':
      return 'right-down';
    case 'right-down':
      return 'down-left';
    case 'down-left':
      return 'left-up';
    case 'left-up':
    default:
      return 'up-right';
  }
}

function getNextTeeOrientation(
  orientation: TeeOrientation,
): TeeOrientation {
  switch (orientation) {
    case 'up-right-down':
      return 'right-down-left';
    case 'right-down-left':
      return 'down-left-up';
    case 'down-left-up':
      return 'left-up-right';
    case 'left-up-right':
    default:
      return 'up-right-down';
  }
}
