import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BoardCellModel, GameBoardModel } from '../game/models/board';
import { PipePreview } from './PipePreview';

type GameBoardProps = {
  board: GameBoardModel;
  onCellPress?: (cell: BoardCellModel) => void;
};

export function GameBoard({ board, onCellPress }: GameBoardProps) {
  return (
    <View style={styles.board}>
      {board.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((cell) => (
            <BoardCell
              key={cell.id}
              cell={cell}
              onPress={onCellPress ? () => onCellPress(cell) : undefined}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type BoardCellProps = {
  cell: BoardCellModel;
  onPress?: () => void;
};

function BoardCell({ cell, onPress }: BoardCellProps) {
  const marker = getCellMarker(cell);
  const canPlace = cell.cellType === 'empty' && !cell.pipe && Boolean(onPress);
  const canRotate = cell.cellType === 'empty' && Boolean(cell.pipe) && Boolean(onPress);
  const isPressable = canPlace || canRotate;

  return (
    <Pressable
      disabled={!isPressable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        cell.cellType === 'blocked' && styles.blockedCell,
        cell.cellType === 'source' && styles.sourceCell,
        cell.cellType === 'target' && styles.targetCell,
        canPlace && styles.placeableCell,
        canRotate && styles.rotatableCell,
        pressed && isPressable && styles.pressedCell,
      ]}
    >
      {marker ? (
        <View style={[styles.markerBadge, cell.cellType === 'source' && styles.sourceMarkerBadge, cell.cellType === 'target' && styles.targetMarkerBadge]}>
          <Text style={styles.markerText}>{marker}</Text>
        </View>
      ) : (
        <PipePreview pipe={cell.pipe} variant="board" />
      )}
    </Pressable>
  );
}

function getCellMarker(cell: BoardCellModel): string | null {
  switch (cell.cellType) {
    case 'blocked':
      return null;
    case 'source':
      return 'SU';
    case 'target':
      return 'HEDEF';
    case 'empty':
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    maxWidth: 364,
    aspectRatio: 1,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: '#C8A26C',
    backgroundColor: '#E5C997',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D5B584',
    backgroundColor: '#F5E3BA',
  },
  placeableCell: {
    backgroundColor: '#F7E9C6',
  },
  rotatableCell: {
    backgroundColor: '#F3DFB1',
  },
  pressedCell: {
    backgroundColor: '#E6C98E',
  },
  blockedCell: {
    backgroundColor: '#AE8F64',
  },
  sourceCell: {
    backgroundColor: '#D3E6F6',
  },
  targetCell: {
    backgroundColor: '#DFF1D9',
  },
  markerBadge: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#E9D9B6',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sourceMarkerBadge: {
    backgroundColor: '#2E77BF',
  },
  targetMarkerBadge: {
    backgroundColor: '#3C423F',
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
