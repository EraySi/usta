import type { LevelData } from '../models/level';

export const WORLD_1_LEVELS: LevelData[] = [
  {
    id: 'w1-1',
    world: 1,
    name: 'Açık Avlu',
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
        label: 'İhtiyaç 1',
        targetId: 'target-1',
        durationSeconds: 90,
      },
    ],
    starRules: {
      oneStar: 15,
      twoStar: 35,
      threeStar: 55,
    },
  },
  {
    id: 'w1-2',
    world: 1,
    name: 'Köşe Dönüşü',
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
        label: 'İhtiyaç 1',
        targetId: 'target-1',
        durationSeconds: 82,
      },
      {
        id: 'need-2',
        label: 'İhtiyaç 2',
        targetId: 'target-1',
        durationSeconds: 68,
      },
    ],
    starRules: {
      oneStar: 14,
      twoStar: 32,
      threeStar: 50,
    },
  },
  {
    id: 'w1-3',
    world: 1,
    name: 'Çatallı Sokak',
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
        label: 'İhtiyaç 1',
        targetId: 'target-1',
        durationSeconds: 95,
      },
      {
        id: 'need-2',
        label: 'İhtiyaç 2',
        targetId: 'target-2',
        durationSeconds: 78,
      },
      {
        id: 'need-3',
        label: 'İhtiyaç 3',
        targetId: 'target-1',
        durationSeconds: 64,
      },
    ],
    starRules: {
      oneStar: 16,
      twoStar: 36,
      threeStar: 56,
    },
  },
];
