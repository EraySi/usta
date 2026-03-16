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
  const isPressable = cell.cellType === 'empty' && !cell.pipe && Boolean(onPress);

  return (
    <Pressable
      disabled={!isPressable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        cell.cellType === 'blocked' && styles.blockedCell,
        cell.cellType === 'source' && styles.sourceCell,
        cell.cellType === 'target' && styles.targetCell,
        isPressable && styles.placeableCell,
        pressed && isPressable && styles.pressedCell,
      ]}
    >
      {marker ? (
        <Text style={styles.markerText}>{marker}</Text>
      ) : (
        <PipePreview pipe={cell.pipe} />
      )}
    </Pressable>
  );
}

function getCellMarker(cell: BoardCellModel): string | null {
  switch (cell.cellType) {
    case 'blocked':
      return 'X';
    case 'source':
      return 'S';
    case 'target':
      return 'T';
    case 'empty':
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  board: {
    width: '100%',
    maxWidth: 360,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#F6F6F6',
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
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  placeableCell: {
    backgroundColor: '#FCFCFC',
  },
  pressedCell: {
    backgroundColor: '#F3F4F6',
  },
  blockedCell: {
    backgroundColor: '#E5E7EB',
  },
  sourceCell: {
    backgroundColor: '#DBEAFE',
  },
  targetCell: {
    backgroundColor: '#DCFCE7',
  },
  markerText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
  },
});
