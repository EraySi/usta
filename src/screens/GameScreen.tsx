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
import { PlumberPopup } from '../components/PlumberPopup';
import { PipeTray } from '../components/PipeTray';
import type { BoardCellModel, GameBoardModel } from '../game/models/board';
import { getGameOutcome } from '../game/engine/gameOutcome';
import type { NeedTimerState } from '../game/models/need';
import type { PipeType } from '../game/models/pipes';
import { loadLevel } from '../game/engine/levelLoader';
import {
  canPlacePipeInCell,
  canMovePipeToCell,
  canRotatePipeInCell,
  getAvailablePiecesForBoard,
  getFirstAvailablePipeType,
  hasAvailablePiece,
  movePipeOnBoard,
  placePipeOnBoard,
  removePipeFromBoard,
  rotatePipeOnBoard,
} from '../game/engine/pipePlacement';
import {
  createNeedTimerState,
  tickNeedTimerState,
} from '../game/engine/needTimer';
import { createLevelWinResult } from '../game/engine/starScoring';
import type { GameScreenProps } from './types';

const FIXTURE_NAMES = ['Mutfak Lavabosu', 'Banyo Lavabosu', 'Çamaşır Musluğu'];
const TARGET_BADGE_COLORS = ['#2B73B5', '#C97831', '#3F4347'];

export function GameScreen({ navigate, levelId, onWinLevel }: GameScreenProps) {
  const loadedLevel = useMemo(() => {
    return levelId ? loadLevel(levelId) : null;
  }, [levelId]);
  const [board, setBoard] = useState<GameBoardModel | null>(null);
  const [selectedPipeType, setSelectedPipeType] = useState<PipeType | null>(null);
  const [needState, setNeedState] = useState<NeedTimerState | null>(null);

  const availablePieces = useMemo(() => {
    if (!loadedLevel) {
      return [];
    }

    return getAvailablePiecesForBoard(loadedLevel.level.availablePieces, board);
  }, [board, loadedLevel]);

  useEffect(() => {
    if (!loadedLevel) {
      setBoard(null);
      setSelectedPipeType(null);
      setNeedState(null);
      return;
    }

    setBoard(loadedLevel.board);
    setSelectedPipeType(
      getFirstAvailablePipeType(loadedLevel.level.availablePieces),
    );
    setNeedState(createNeedTimerState(loadedLevel.level));
  }, [loadedLevel]);

  useEffect(() => {
    if (selectedPipeType && !hasAvailablePiece(availablePieces, selectedPipeType)) {
      setSelectedPipeType(getFirstAvailablePipeType(availablePieces));
    }
  }, [availablePieces, selectedPipeType]);

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
          <Text style={styles.title}>Oyun</Text>
          <Text style={styles.subtitle}>Yerel örnek bölüm bulunamadı.</Text>

          <View style={styles.actions}>
            <Pressable onPress={() => navigate('home')} style={styles.button}>
              <Text style={styles.buttonText}>Ana Sayfa</Text>
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
    const nextAvailablePieces = loadedLevel
      ? getAvailablePiecesForBoard(loadedLevel.level.availablePieces, nextBoard)
      : availablePieces;

    setBoard(nextBoard);

    if (!hasAvailablePiece(nextAvailablePieces, selectedPipeType)) {
      setSelectedPipeType(getFirstAvailablePipeType(nextAvailablePieces));
    }
  }

  function handleMovePipe(
    fromCell: BoardCellModel,
    toCell: BoardCellModel | null,
  ) {
    if (!board || !fromCell.pipe) {
      return;
    }

    if (!toCell) {
      const nextBoard = removePipeFromBoard(board, fromCell);
      const nextAvailablePieces = loadedLevel
        ? getAvailablePiecesForBoard(loadedLevel.level.availablePieces, nextBoard)
        : availablePieces;

      setBoard(nextBoard);

      if (!selectedPipeType) {
        setSelectedPipeType(getFirstAvailablePipeType(nextAvailablePieces));
      }

      return;
    }

    if (!canMovePipeToCell(toCell)) {
      return;
    }

    setBoard(movePipeOnBoard(board, fromCell, toCell));
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
      ? 'Bekleniyor'
      : FIXTURE_NAMES[activeTargetIndex] ?? `Oda ${activeTargetIndex + 1}`;
  const activeTargetBadgeColor =
    activeTargetIndex === -1
      ? '#3F4347'
      : TARGET_BADGE_COLORS[activeTargetIndex] ?? '#3F4347';
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
            activeNeedLabel={needState?.activeNeed?.label ?? 'Aktif ihtiyaç yok'}
            activeTargetId={activeTargetId}
            countdownLabel={countdownLabel}
            isExpired={Boolean(needState?.isExpired)}
            needProgress={needProgress}
            targets={houseTargets}
          />

          <View style={styles.playfieldSection}>
            <View style={styles.playfieldHeader}>
              <Text style={styles.boardLabel}>Boru Alanı</Text>
              <View
                style={[
                  styles.boardTargetBadge,
                  { backgroundColor: activeTargetBadgeColor },
                ]}
              >
                <Text style={styles.boardTargetBadgeLabel}>Hedef</Text>
                <Text style={styles.boardTargetBadgeValue}>
                  {activeTargetLabel}
                </Text>
              </View>
            </View>

            <View style={styles.groundArea}>
              <View style={styles.groundStoneOne} />
              <View style={styles.groundStoneTwo} />
              <View style={styles.groundStoneThree} />

              <View style={styles.boardFrame}>
                <View style={styles.boardShadow} />
                <View style={styles.boardPlate}>
                  <GameBoard
                    board={board}
                    onMovePipe={canInteractWithBoard ? handleMovePipe : undefined}
                    onCellPress={canInteractWithBoard ? handleBoardCellPress : undefined}
                  />
                </View>
              </View>

              <View style={styles.boardHintBubble}>
                <Text style={styles.helperText}>
                  Bir boru seç, tahtaya yerleştir. Yanlış koyduysan sürükleyip başka hücreye taşı ya da tahtanın dışına bırakıp geri al.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <PlumberPopup
          message={`${activeTargetLabel} için suyu bağla. Yerleştirdiğin boruya dokunarak döndür, istersen sürükleyip başka hücreye taşı ya da alanın dışına bırakıp geri al.`}
          popupKey={`${levelId ?? 'no-level'}-${needState?.activeNeed?.id ?? 'no-need'}`}
          title={needState?.activeNeed?.label ?? 'İhtiyaç'}
        />

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
    paddingBottom: 300,
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
  playfieldSection: {
    width: '100%',
    marginTop: 2,
  },
  playfieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  boardLabel: {
    color: '#9D7142',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  boardTargetBadge: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  boardTargetBadgeLabel: {
    color: '#F4F6F7',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  boardTargetBadgeValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 3,
    textAlign: 'center',
  },
  groundArea: {
    borderRadius: 34,
    backgroundColor: '#8D5D2E',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    overflow: 'hidden',
  },
  groundStoneOne: {
    position: 'absolute',
    left: 14,
    top: 58,
    width: 36,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#B88D58',
  },
  groundStoneTwo: {
    position: 'absolute',
    right: 30,
    top: 110,
    width: 28,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#A97D48',
  },
  groundStoneThree: {
    position: 'absolute',
    right: 54,
    bottom: 64,
    width: 18,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#C39C66',
  },
  boardFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  boardShadow: {
    position: 'absolute',
    top: 12,
    width: '88%',
    height: '90%',
    borderRadius: 34,
    backgroundColor: '#6B451F',
  },
  boardPlate: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#F7E9C8',
    padding: 12,
    borderWidth: 3,
    borderColor: '#DDBA84',
  },
  boardHintBubble: {
    borderRadius: 24,
    backgroundColor: '#F8EFD9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  helperText: {
    color: '#62492F',
    fontSize: 13,
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
