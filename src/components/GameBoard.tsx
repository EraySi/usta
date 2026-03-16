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
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#35576B',
    backgroundColor: '#E7D7BA',
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
    borderColor: '#CBB28D',
    backgroundColor: '#FFFDF8',
  },
  placeableCell: {
    backgroundColor: '#FFF7EA',
  },
  pressedCell: {
    backgroundColor: '#F2E0C5',
  },
  blockedCell: {
    backgroundColor: '#C8B8A2',
  },
  sourceCell: {
    backgroundColor: '#CFE6F2',
  },
  targetCell: {
    backgroundColor: '#D9F0DD',
  },
  markerText: {
    color: '#173042',
    fontSize: 15,
    fontWeight: '800',
  },
});
