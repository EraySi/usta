import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import type { WinScreenProps } from './types';

export function WinScreen({ navigate, result }: WinScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>You Win</Text>
        <Text style={styles.subtitle}>
          {result
            ? `${result.levelName} completed with ${result.stars}/3 stars.`
            : 'Level completed.'}
        </Text>

        {result ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Stars</Text>
            <Text style={styles.summaryValue}>{result.stars}/3</Text>
            <Text style={styles.summaryMeta}>
              Time left: {formatCountdown(result.remainingSeconds)}
            </Text>
            <Text style={styles.summaryMeta}>Target: {result.targetId}</Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable onPress={() => navigate('game')} style={styles.button}>
            <Text style={styles.buttonText}>Play Again</Text>
          </Pressable>
          <Pressable onPress={() => navigate('home')} style={styles.button}>
            <Text style={styles.buttonText}>Back Home</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

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
    paddingHorizontal: 24,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  summaryLabel: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: '#111111',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryMeta: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: 12,
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
