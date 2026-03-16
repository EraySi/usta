import { StyleSheet, Text, View } from 'react-native';

type GameHudProps = {
  levelName: string;
  world: number;
  gridSize: number;
  countdownLabel: string;
  isExpired: boolean;
};

export function GameHud({
  levelName,
  world,
  gridSize,
  countdownLabel,
  isExpired,
}: GameHudProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stageChip}>
        <Text style={styles.stageChipWorld}>Stage {world}</Text>
        <Text style={styles.stageChipLevel}>{levelName}</Text>
      </View>

      <View style={styles.centerInfo}>
        <Text style={styles.centerLabel}>Grid</Text>
        <Text style={styles.centerValue}>{gridSize}x{gridSize}</Text>
      </View>

      <View style={[styles.timerChip, isExpired && styles.timerChipExpired]}>
        <Text style={styles.timerChipLabel}>Order Rush</Text>
        <Text style={styles.timerChipValue}>{countdownLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  stageChip: {
    flex: 1.4,
    borderRadius: 22,
    backgroundColor: '#FFF2D2',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  stageChipWorld: {
    color: '#9A6C3D',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  stageChipLevel: {
    color: '#3E2D20',
    fontSize: 16,
    fontWeight: '800',
  },
  centerInfo: {
    minWidth: 72,
    borderRadius: 22,
    backgroundColor: '#E3D2AA',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  centerLabel: {
    color: '#7B6448',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  centerValue: {
    color: '#3F362C',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  timerChip: {
    minWidth: 98,
    borderRadius: 22,
    backgroundColor: '#CD7753',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timerChipExpired: {
    backgroundColor: '#A53A2F',
  },
  timerChipLabel: {
    color: '#FFEAD5',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  timerChipValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
});
