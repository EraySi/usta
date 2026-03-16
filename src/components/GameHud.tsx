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
    <View style={styles.frame}>
      <View style={styles.container}>
        <View style={styles.stageChip}>
          <Text style={styles.stageChipWorld}>BÖLÜM {world}</Text>
          <Text style={styles.stageChipLevel}>{levelName}</Text>
        </View>

        <View style={styles.centerInfo}>
          <Text style={styles.centerLabel}>IZGARA</Text>
          <Text style={styles.centerValue}>{gridSize}x{gridSize}</Text>
        </View>

        <View style={[styles.timerChip, isExpired && styles.timerChipExpired]}>
          <Text style={styles.timerChipLabel}>SÜRE</Text>
          <Text style={styles.timerChipValue}>{countdownLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderRadius: 22,
    backgroundColor: '#925629',
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginBottom: 12,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  stageChip: {
    flex: 1.4,
    borderRadius: 18,
    backgroundColor: '#7A451F',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  stageChipWorld: {
    color: '#F7D594',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  stageChipLevel: {
    color: '#FFF7E8',
    fontSize: 16,
    fontWeight: '800',
  },
  centerInfo: {
    minWidth: 72,
    borderRadius: 18,
    backgroundColor: '#7A451F',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  centerLabel: {
    color: '#EACB8C',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  centerValue: {
    color: '#FFF4DF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  timerChip: {
    minWidth: 98,
    borderRadius: 18,
    backgroundColor: '#1F5F97',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timerChipExpired: {
    backgroundColor: '#A53A2F',
  },
  timerChipLabel: {
    color: '#D3E8F8',
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
