import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { GameBoard } from '../components/GameBoard';
import { WORLD_1_LEVELS } from '../game/data';
import { loadLevel } from '../game/engine/levelLoader';
import {
  createNeedTimerState,
  tickNeedTimerState,
} from '../game/engine/needTimer';
import type { ScreenProps } from './types';

const selectedLevel = WORLD_1_LEVELS[0];
const loadedLevel = selectedLevel ? loadLevel(selectedLevel.id) : null;

export function GameScreen({ navigate }: ScreenProps) {
  const [needState, setNeedState] = useState(() =>
    loadedLevel ? createNeedTimerState(loadedLevel.level) : null,
  );

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

  if (!loadedLevel) {
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
          <Text
            style={[
              styles.countdown,
              needState?.isExpired && styles.countdownExpired,
            ]}
          >
            {formatCountdown(needState?.remainingSeconds ?? 0)}
          </Text>
        </View>

        <GameBoard board={loadedLevel.board} />

        <View style={styles.actions}>
          <Pressable onPress={() => navigate('win')} style={styles.button}>
            <Text style={styles.buttonText}>Simulate Win</Text>
          </Pressable>
          <Pressable onPress={() => navigate('lose')} style={styles.button}>
            <Text style={styles.buttonText}>Simulate Lose</Text>
          </Pressable>
        </View>
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
    marginBottom: 8,
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
