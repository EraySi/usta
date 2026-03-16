import { useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { BoardCellModel, GameBoardModel } from '../game/models/board';
import { PipePreview } from './PipePreview';

type GameBoardProps = {
  board: GameBoardModel;
  onCellPress?: (cell: BoardCellModel) => void;
  onMovePipe?: (fromCell: BoardCellModel, toCell: BoardCellModel | null) => void;
};

type BoardBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const INITIAL_BOUNDS: BoardBounds = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export function GameBoard({ board, onCellPress, onMovePipe }: GameBoardProps) {
  const boardRef = useRef<View>(null);
  const [boardBounds, setBoardBounds] = useState<BoardBounds>(INITIAL_BOUNDS);

  function updateBoardBounds() {
    boardRef.current?.measureInWindow((x, y, width, height) => {
      setBoardBounds({ x, y, width, height });
    });
  }

  return (
    <View
      ref={boardRef}
      onLayout={updateBoardBounds}
      onTouchStart={updateBoardBounds}
      style={styles.board}
    >
      {board.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((cell) => (
            <BoardCell
              key={cell.id}
              board={board}
              boardBounds={boardBounds}
              cell={cell}
              onMovePipe={onMovePipe}
              onPress={onCellPress ? () => onCellPress(cell) : undefined}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type BoardCellProps = {
  board: GameBoardModel;
  boardBounds: BoardBounds;
  cell: BoardCellModel;
  onMovePipe?: (fromCell: BoardCellModel, toCell: BoardCellModel | null) => void;
  onPress?: () => void;
};

function BoardCell({
  board,
  boardBounds,
  cell,
  onMovePipe,
  onPress,
}: BoardCellProps) {
  const marker = getCellMarker(cell);
  const canPlace = cell.cellType === 'empty' && !cell.pipe && Boolean(onPress);
  const canDragOrRotate = cell.cellType === 'empty' && Boolean(cell.pipe) && Boolean(onPress);
  const isPressable = canPlace || canDragOrRotate;

  return (
    <View
      style={[
        styles.cell,
        cell.cellType === 'blocked' && styles.blockedCell,
        cell.cellType === 'source' && styles.sourceCell,
        cell.cellType === 'target' && styles.targetCell,
        canPlace && styles.placeableCell,
        canDragOrRotate && styles.rotatableCell,
      ]}
    >
      {marker ? (
        <View
          style={[
            styles.markerBadge,
            cell.cellType === 'source' && styles.sourceMarkerBadge,
            cell.cellType === 'target' && styles.targetMarkerBadge,
          ]}
        >
          <Text style={styles.markerText}>{marker}</Text>
        </View>
      ) : cell.pipe ? (
        <DraggablePipe
          board={board}
          boardBounds={boardBounds}
          cell={cell}
          onMovePipe={onMovePipe}
          onRotate={onPress}
        />
      ) : (
        <Pressable
          disabled={!isPressable}
          onPress={onPress}
          style={({ pressed }) => [
            styles.emptyCellPressable,
            pressed && isPressable && styles.pressedCell,
          ]}
        >
          <View style={styles.tileTexture}>
            <View style={styles.tileDotLarge} />
            <View style={styles.tileDotSmall} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

type DraggablePipeProps = {
  board: GameBoardModel;
  boardBounds: BoardBounds;
  cell: BoardCellModel;
  onMovePipe?: (fromCell: BoardCellModel, toCell: BoardCellModel | null) => void;
  onRotate?: () => void;
};

function DraggablePipe({
  board,
  boardBounds,
  cell,
  onMovePipe,
  onRotate,
}: DraggablePipeProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const latestRef = useRef({
    board,
    boardBounds,
    cell,
    onMovePipe,
    onRotate,
  });

  latestRef.current = {
    board,
    boardBounds,
    cell,
    onMovePipe,
    onRotate,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        isDraggingRef.current = false;
        setIsDragging(false);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        const hasMoved = Math.abs(gestureState.dx) > 6 || Math.abs(gestureState.dy) > 6;

        if (!isDraggingRef.current && hasMoved) {
          isDraggingRef.current = true;
          setIsDragging(true);
          Animated.spring(scale, {
            toValue: 1.2,
            friction: 6,
            tension: 90,
            useNativeDriver: true,
          }).start();
        }

        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        const hasDragged =
          isDraggingRef.current ||
          Math.abs(gestureState.dx) > 6 ||
          Math.abs(gestureState.dy) > 6;

        if (!hasDragged) {
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              friction: 7,
              tension: 80,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 7,
              tension: 80,
              useNativeDriver: true,
            }),
          ]).start();

          latestRef.current.onRotate?.();
          setIsDragging(false);
          return;
        }

        const targetCell = getBoardCellFromScreenPosition(
          latestRef.current.board,
          latestRef.current.boardBounds,
          gestureState.moveX,
          gestureState.moveY,
        );

        latestRef.current.onMovePipe?.(latestRef.current.cell, targetCell);

        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
        ]).start(() => {
          isDraggingRef.current = false;
          setIsDragging(false);
        });
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 7,
            tension: 80,
            useNativeDriver: true,
          }),
        ]).start(() => {
          isDraggingRef.current = false;
          setIsDragging(false);
        });
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      style={[
        styles.draggableArea,
        isDragging && styles.draggingPipe,
        {
          transform: [...pan.getTranslateTransform(), { scale }],
        },
      ]}
    >
      <PipePreview pipe={cell.pipe} variant="board" />
    </Animated.View>
  );
}

function getBoardCellFromScreenPosition(
  board: GameBoardModel,
  boardBounds: BoardBounds,
  screenX: number,
  screenY: number,
): BoardCellModel | null {
  if (!boardBounds.width || !boardBounds.height || !board.length || !board[0]?.length) {
    return null;
  }

  const relativeX = screenX - boardBounds.x;
  const relativeY = screenY - boardBounds.y;

  if (
    relativeX < 0 ||
    relativeY < 0 ||
    relativeX > boardBounds.width ||
    relativeY > boardBounds.height
  ) {
    return null;
  }

  const cellWidth = boardBounds.width / board[0].length;
  const cellHeight = boardBounds.height / board.length;
  const column = Math.min(board[0].length - 1, Math.floor(relativeX / cellWidth));
  const row = Math.min(board.length - 1, Math.floor(relativeY / cellHeight));

  return board[row]?.[column] ?? null;
}

function getCellMarker(cell: BoardCellModel): string | null {
  switch (cell.cellType) {
    case 'blocked':
      return null;
    case 'source':
      return 'SU';
    case 'target':
      return 'GİDER';
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
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#D0AD78',
    backgroundColor: '#EED7AB',
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
    borderColor: '#D7B684',
    backgroundColor: '#F6E7BE',
  },
  emptyCellPressable: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeableCell: {
    backgroundColor: '#F8EBC9',
  },
  rotatableCell: {
    backgroundColor: '#F2E1B4',
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
    minWidth: 52,
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
  tileTexture: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileDotLarge: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#E8D4A7',
  },
  tileDotSmall: {
    position: 'absolute',
    right: 1,
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D8BE8C',
  },
  draggableArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  draggingPipe: {
    zIndex: 20,
    elevation: 10,
  },
});
