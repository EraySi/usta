import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { GameBoard } from '../components/GameBoard';
import { WORLD_1_LEVELS } from '../game/data';
import { loadLevel } from '../game/engine/levelLoader';
import type { ScreenProps } from './types';

const selectedLevel = WORLD_1_LEVELS[0];
const loadedLevel = selectedLevel ? loadLevel(selectedLevel.id) : null;

export function GameScreen({ navigate }: ScreenProps) {
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
    marginBottom: 24,
    textAlign: 'center',
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
