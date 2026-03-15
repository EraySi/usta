import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { GameBoard } from '../components/GameBoard';
import { createInitialBoard } from '../game/models/board';
import type { ScreenProps } from './types';

const board = createInitialBoard();

export function GameScreen({ navigate }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Game</Text>
        <Text style={styles.subtitle}>
          A 6x6 placeholder board is ready for future pipe placement.
        </Text>

        <GameBoard board={board} />

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
