import { StyleSheet, Text, View } from 'react-native';

import type { BoardCellModel, GameBoardModel } from '../game/models/board';

type GameBoardProps = {
  board: GameBoardModel;
};

export function GameBoard({ board }: GameBoardProps) {
  return (
    <View style={styles.board}>
      {board.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((cell) => (
            <BoardCell key={cell.id} cell={cell} />
          ))}
        </View>
      ))}
    </View>
  );
}

type BoardCellProps = {
  cell: BoardCellModel;
};

function BoardCell({ cell }: BoardCellProps) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellText}>{cell.pipeType ?? ''}</Text>
    </View>
  );
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
  cellText: {
    color: '#555555',
    fontSize: 12,
    fontWeight: '500',
  },
});
