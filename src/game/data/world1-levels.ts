import type { LevelData } from '../models/level';

export const WORLD_1_LEVELS: LevelData[] = [
  {
    id: 'w1-1',
    world: 1,
    name: 'Open Yard',
    gridSize: 6,
    source: {
      row: 0,
      column: 0,
      direction: 'right',
    },
    targets: [
      {
        id: 'target-1',
        row: 0,
        column: 5,
        direction: 'left',
      },
    ],
    blockedCells: [],
    availablePieces: [
      { type: 'straight', count: 5 },
      { type: 'corner', count: 3 },
      { type: 'tee', count: 1 },
    ],
    needSequence: [
      {
        id: 'need-1',
        label: 'Need 1',
        durationSeconds: 30,
      },
    ],
    starRules: {
      oneStar: 600,
      twoStar: 900,
      threeStar: 1200,
    },
  },
  {
    id: 'w1-2',
    world: 1,
    name: 'Corner Turn',
    gridSize: 6,
    source: {
      row: 1,
      column: 0,
      direction: 'right',
    },
    targets: [
      {
        id: 'target-1',
        row: 5,
        column: 4,
        direction: 'up',
      },
    ],
    blockedCells: [
      { row: 2, column: 2 },
      { row: 3, column: 2 },
    ],
    availablePieces: [
      { type: 'straight', count: 4 },
      { type: 'corner', count: 5 },
      { type: 'tee', count: 1 },
    ],
    needSequence: [
      {
        id: 'need-1',
        label: 'Need 1',
        durationSeconds: 28,
      },
      {
        id: 'need-2',
        label: 'Need 2',
        durationSeconds: 24,
      },
    ],
    starRules: {
      oneStar: 700,
      twoStar: 1000,
      threeStar: 1300,
    },
  },
  {
    id: 'w1-3',
    world: 1,
    name: 'Split Street',
    gridSize: 6,
    source: {
      row: 2,
      column: 0,
      direction: 'right',
    },
    targets: [
      {
        id: 'target-1',
        row: 0,
        column: 5,
        direction: 'left',
      },
      {
        id: 'target-2',
        row: 5,
        column: 5,
        direction: 'left',
      },
    ],
    blockedCells: [
      { row: 1, column: 3 },
      { row: 4, column: 1 },
    ],
    availablePieces: [
      { type: 'straight', count: 5 },
      { type: 'corner', count: 4 },
      { type: 'tee', count: 3 },
    ],
    needSequence: [
      {
        id: 'need-1',
        label: 'Need 1',
        durationSeconds: 26,
      },
      {
        id: 'need-2',
        label: 'Need 2',
        durationSeconds: 22,
      },
      {
        id: 'need-3',
        label: 'Need 3',
        durationSeconds: 18,
      },
    ],
    starRules: {
      oneStar: 800,
      twoStar: 1100,
      threeStar: 1400,
    },
  },
];
