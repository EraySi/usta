import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { GameBoard } from '../components/GameBoard';
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
import type { GameScreenProps } from './types';

export function GameScreen({ navigate, levelId }: GameScreenProps) {
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

    if (outcome) {
      navigate(outcome);
    }
  }, [board, navigate, needState]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>{loadedLevel.level.name}</Text>
        <Text style={styles.subtitle}>
          World {loadedLevel.level.world} · {loadedLevel.level.gridSize}x
          {loadedLevel.level.gridSize} board loaded from local level data.
        </Text>

        <View style={styles.needCard}>
          <Text style={styles.needLabel}>Active Need</Text>
          <Text style={styles.needTitle}>
            {needState?.activeNeed?.label ?? 'No active need'}
          </Text>
          <Text style={styles.needTarget}>
            Target: {needState?.activeNeed?.targetId ?? 'None'}
          </Text>
          <Text
            style={[
              styles.countdown,
              needState?.isExpired && styles.countdownExpired,
            ]}
          >
            {formatCountdown(needState?.remainingSeconds ?? 0)}
          </Text>
        </View>

        <GameBoard
          board={board}
          onCellPress={canPlaceSelectedPipe ? handleBoardCellPress : undefined}
        />

        <PipeTray
          availablePieces={availablePieces}
          selectedPipeType={selectedPipeType}
          onSelectPipeType={setSelectedPipeType}
        />

        <Text style={styles.helperText}>
          Connect the source to the active target before the timer ends.
        </Text>
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    color: '#111111',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#666666',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  needCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  needLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  needTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  needTarget: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 10,
  },
  countdown: {
    color: '#0F766E',
    fontSize: 28,
    fontWeight: '700',
  },
  countdownExpired: {
    color: '#B91C1C',
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  helperText: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
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
