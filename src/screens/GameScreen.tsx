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
  canRotatePipeInCell,
  consumeAvailablePiece,
  getFirstAvailablePipeType,
  hasAvailablePiece,
  placePipeOnBoard,
  rotatePipeOnBoard,
} from '../game/engine/pipePlacement';
import {
  createNeedTimerState,
  tickNeedTimerState,
} from '../game/engine/needTimer';
import { createLevelWinResult } from '../game/engine/starScoring';
import type { GameScreenProps } from './types';

const FIXTURE_NAMES = ['Kitchen Sink', 'Bathroom Tub', 'Laundry Tap'];

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
    if (board && canRotatePipeInCell(cell)) {
      setBoard(rotatePipeOnBoard(board, cell));
      return;
    }

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

  const canInteractWithBoard = !needState?.isExpired;
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
    activeTargetIndex === -1
      ? 'Waiting'
      : FIXTURE_NAMES[activeTargetIndex] ?? `Room ${activeTargetIndex + 1}`;
  const needProgress =
    needState?.activeNeed?.durationSeconds
      ? needState.remainingSeconds / needState.activeNeed.durationSeconds
      : 0;

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
            needProgress={needProgress}
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
                onCellPress={canInteractWithBoard ? handleBoardCellPress : undefined}
              />
            </View>

            <Text style={styles.helperText}>
              Pick a pipe to place it. Tap a placed pipe again to rotate it.
            </Text>
          </View>

          <View style={styles.promptRow}>
            <View style={styles.promptCharacter}>
              <View style={styles.promptCap} />
              <View style={styles.promptFace}>
                <View style={styles.promptEye} />
                <View style={styles.promptEye} />
              </View>
            </View>

            <View style={styles.promptBubble}>
              <Text style={styles.promptTitle}>Quick, connect the pipes.</Text>
              <Text style={styles.promptText}>
                Place pieces from the toolbox and rotate them until the water reaches the room.
              </Text>
            </View>
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
    backgroundColor: '#E4BF84',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: '#B88749',
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
    color: '#5E4732',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 14,
  },
  promptCharacter: {
    width: 78,
    alignItems: 'center',
  },
  promptCap: {
    width: 52,
    height: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#2E78BE',
    marginBottom: -2,
    zIndex: 1,
  },
  promptFace: {
    width: 64,
    height: 70,
    borderRadius: 32,
    backgroundColor: '#F7D5A6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  promptEye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A311F',
  },
  promptBubble: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#FFF7E7',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  promptTitle: {
    color: '#3F342A',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  promptText: {
    color: '#6B5B4A',
    fontSize: 13,
    lineHeight: 18,
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
