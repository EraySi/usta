import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { WORLD_1_LEVELS } from '../game/data';
import type { LevelSelectScreenProps } from './types';

export function LevelSelectScreen({
  navigate,
  selectedLevelId,
  onSelectLevel,
}: LevelSelectScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Bölüm Seç</Text>
        <Text style={styles.subtitle}>1. dünya bölümlerinden birini seç.</Text>

        <View style={styles.levelList}>
          {WORLD_1_LEVELS.map((level) => {
            const isSelected = selectedLevelId === level.id;

            return (
              <Pressable
                key={level.id}
                onPress={() => {
                  onSelectLevel(level.id);
                  navigate('game');
                }}
                style={[
                  styles.levelButton,
                  isSelected && styles.selectedLevelButton,
                ]}
              >
                <Text style={styles.levelName}>{level.name}</Text>
                <Text style={styles.levelMeta}>
                  {level.id} · {level.gridSize}x{level.gridSize}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={() => navigate('home')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Ana Sayfa</Text>
        </Pressable>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  levelList: {
    gap: 12,
  },
  levelButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectedLevelButton: {
    borderColor: '#111111',
    backgroundColor: '#F3F4F6',
  },
  levelName: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  levelMeta: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '500',
  },
  backButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#111111',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
