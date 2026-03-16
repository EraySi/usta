import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GameBoard } from '../components/GameBoard';
import { GameHud } from '../components/GameHud';
import { HouseView } from '../components/HouseView';
import { PipeTray } from '../components/PipeTray';
import type { BoardCellModel, GameBoardModel } from '../game/models/board';
import { getGameOutcome } from '../game/engine/gameOutcome';
import type { AvailablePiece } from '../game/models/level';
import type { NeedTimerState } from '../game/models/need';
import type { PipeType } from '../game/models/pipes';
import { loadLevel } from '../game/engine/levelLoader';
import {
  canPlacePipeInCell,
  consumeAvailablePiece,
  getFirstAvailablePipeType,
  hasAvailablePiece,
  placePipeOnBoard,
} from '../game/engine/pipePlacement';
import {
  createNeedTimerState,
  tickNeedTimerState,
} from '../game/engine/needTimer';
import { createLevelWinResult } from '../game/engine/starScoring';
import type { GameScreenProps } from './types';

export function GameScreen({ navigate, levelId, onWinLevel }: GameScreenProps) {
  const loadedLevel = useMemo(() => {
    return levelId ? loadLevel(levelId) : null;
  }, [levelId]);
  const [board, setBoard] = useState<GameBoardModel | null>(null);
  const [availablePieces, setAvailablePieces] = useState<AvailablePiece[]>([]);
  const [selectedPipeType, setSelectedPipeType] = useState<PipeType | null>(null);
  const [needState, setNeedState] = useState<NeedTimerState | null>(null);

  useEffect(() => {
    if (!loadedLevel) {
      setBoard(null);
      setAvailablePieces([]);
      setSelectedPipeType(null);
      setNeedState(null);
      return;
    }

    setBoard(loadedLevel.board);
    setAvailablePieces(loadedLevel.level.availablePieces.map((piece) => ({ ...piece })));
    setSelectedPipeType(
      getFirstAvailablePipeType(loadedLevel.level.availablePieces),
    );
    setNeedState(createNeedTimerState(loadedLevel.level));
  }, [loadedLevel]);

  useEffect(() => {
    if (!needState?.activeNeed || needState.isExpired) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setNeedState((currentState) =>
        currentState ? tickNeedTimerState(currentState) : currentState,
      );
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [needState]);

  useEffect(() => {
    const outcome = getGameOutcome(board, needState);

    if (outcome === 'win' && loadedLevel && needState) {
      const winResult = createLevelWinResult(loadedLevel.level, needState);

      if (winResult) {
        onWinLevel(winResult);
      }

      navigate('win');
      return;
    }

    if (outcome === 'lose') {
      navigate('lose');
    }
  }, [board, loadedLevel, navigate, needState, onWinLevel]);

  if (!loadedLevel || !board) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={styles.title}>Game</Text>
          <Text style={styles.subtitle}>No local sample level is available.</Text>

          <View style={styles.actions}>
            <Pressable onPress={() => navigate('home')} style={styles.button}>
              <Text style={styles.buttonText}>Back Home</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  function handleBoardCellPress(cell: BoardCellModel) {
    if (
      !board ||
      !canPlacePipeInCell(cell) ||
      !selectedPipeType ||
      !hasAvailablePiece(availablePieces, selectedPipeType)
    ) {
      return;
    }

    const nextBoard = placePipeOnBoard(board, cell, selectedPipeType);
    const nextAvailablePieces = consumeAvailablePiece(
      availablePieces,
      selectedPipeType,
    );

    setBoard(nextBoard);
    setAvailablePieces(nextAvailablePieces);

    if (!hasAvailablePiece(nextAvailablePieces, selectedPipeType)) {
      setSelectedPipeType(getFirstAvailablePipeType(nextAvailablePieces));
    }
  }

  const canPlaceSelectedPipe =
    !needState?.isExpired &&
    selectedPipeType !== null &&
    hasAvailablePiece(availablePieces, selectedPipeType);
  const countdownLabel = formatCountdown(needState?.remainingSeconds ?? 0);
  const activeTargetId = needState?.activeNeed?.targetId ?? null;
  const houseTargets = loadedLevel.level.targets.map((target) => ({
    id: target.id,
    isActive: target.id === activeTargetId,
  }));
  const activeTargetIndex = loadedLevel.level.targets.findIndex(
    (target) => target.id === activeTargetId,
  );
  const activeTargetLabel =
    activeTargetIndex === -1 ? 'Waiting' : `Room ${activeTargetIndex + 1}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GameHud
            countdownLabel={countdownLabel}
            gridSize={loadedLevel.level.gridSize}
            isExpired={Boolean(needState?.isExpired)}
            levelName={loadedLevel.level.name}
            world={loadedLevel.level.world}
          />

          <HouseView
            activeNeedLabel={needState?.activeNeed?.label ?? 'No active need'}
            activeTargetId={activeTargetId}
            countdownLabel={countdownLabel}
            isExpired={Boolean(needState?.isExpired)}
            targets={houseTargets}
          />

          <View style={styles.boardSection}>
            <View style={styles.boardHeader}>
              <View style={styles.boardHeadingText}>
                <Text style={styles.boardLabel}>Pipe Yard</Text>
                <Text style={styles.boardTitle}>Build the route</Text>
                <Text style={styles.boardSubtitle}>
                  Lay pieces on the board and send water into the highlighted fixture.
                </Text>
              </View>

              <View style={styles.boardTargetBadge}>
                <Text style={styles.boardTargetBadgeLabel}>Deliver To</Text>
                <Text style={styles.boardTargetBadgeValue}>
                  {activeTargetLabel}
                </Text>
              </View>
            </View>

            <View style={styles.boardFrame}>
              <View style={styles.boardShadow} />
              <GameBoard
                board={board}
                onCellPress={canPlaceSelectedPipe ? handleBoardCellPress : undefined}
              />
            </View>

            <Text style={styles.helperText}>
              Choose a pipe from the tray, then tap an open tile to place it.
            </Text>
          </View>
        </ScrollView>

        <PipeTray
          availablePieces={availablePieces}
          selectedPipeType={selectedPipeType}
          onSelectPipeType={setSelectedPipeType}
        />
      </View>
    </SafeAreaView>
  );
}

function formatCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFE1C3',
  },
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  title: {
    color: '#173042',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5E6E75',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  boardSection: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#FCF5E6',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: '#E0C9A4',
  },
  boardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  boardHeadingText: {
    flex: 1,
  },
  boardLabel: {
    color: '#9A6D3E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  boardTitle: {
    color: '#243A42',
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 4,
  },
  boardSubtitle: {
    color: '#6B6055',
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 210,
  },
  boardTargetBadge: {
    minWidth: 96,
    borderRadius: 20,
    backgroundColor: '#E7F2E5',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  boardTargetBadgeLabel: {
    color: '#2F7253',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  boardTargetBadgeValue: {
    color: '#174C37',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  boardFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    marginBottom: 12,
  },
  boardShadow: {
    position: 'absolute',
    top: 22,
    width: '86%',
    height: '88%',
    borderRadius: 28,
    backgroundColor: '#D7C3A2',
  },
  helperText: {
    color: '#6B6055',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#111111',
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
