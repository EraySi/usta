import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LoopAvatar } from './LoopAvatar';

type HouseTarget = {
  id: string;
  isActive: boolean;
};

type HouseViewProps = {
  activeNeedLabel: string;
  activeTargetId: string | null;
  countdownLabel: string;
  isExpired: boolean;
  needProgress: number;
  targets: HouseTarget[];
};

const FIXTURE_NAMES = ['Mutfak Lavabosu', 'Banyo Lavabosu', 'Çamaşır Musluğu'] as const;
const TARGET_ROOM_KEYS = ['kitchen', 'bath', 'laundry'] as const;

type TargetRoomKey = (typeof TARGET_ROOM_KEYS)[number];

export function HouseView({
  activeNeedLabel,
  activeTargetId,
  countdownLabel,
  isExpired,
  needProgress,
  targets,
}: HouseViewProps) {
  const progress = Math.max(0, Math.min(needProgress, 1));
  const progressWidth = `${progress * 100}%` as `${number}%`;
  const activeIndex = targets.findIndex((target) => target.id === activeTargetId);
  const resolvedIndex = activeIndex === -1 ? 0 : activeIndex;
  const activeFixtureLabel = FIXTURE_NAMES[resolvedIndex] ?? FIXTURE_NAMES[0];
  const activeRoomKey = TARGET_ROOM_KEYS[resolvedIndex] ?? TARGET_ROOM_KEYS[0];

  return (
    <View style={styles.scene}>
      <View style={styles.hudRow}>
        <View style={styles.needChip}>
          <LoopAvatar size={58} variant="resident" />

          <View style={styles.chipContent}>
            <Text style={styles.chipLabel}>İhtiyaç</Text>
            <Text style={styles.chipValue}>{Math.round(progress * 100)}%</Text>
            <View style={styles.trackWarm}>
              <View style={[styles.trackFill, { width: progressWidth }]} />
            </View>
          </View>
        </View>

        <View style={[styles.fixtureChip, isExpired && styles.fixtureChipExpired]}>
          <LoopAvatar size={58} variant="customer" />

          <View style={styles.chipContent}>
            <Text style={styles.chipLabel}>Hedef</Text>
            <Text numberOfLines={1} style={styles.fixtureValue}>
              {activeFixtureLabel}
            </Text>
            <View style={styles.trackCool}>
              <View style={[styles.trackFill, { width: progressWidth }]} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.houseScene}>
        <View style={styles.skyBackdrop} />
        <View style={styles.sunGlow} />
        <View style={styles.cloudOne} />
        <View style={styles.cloudTwo} />

        <View style={styles.roofLine} />
        <View style={styles.roofPeak} />

        <View style={styles.houseFrame}>
          <View style={styles.topFloor}>
            <RoomTile>
              <View style={styles.sofaBack} />
              <View style={styles.sofaSeat} />
              <View style={styles.blanket} />
            </RoomTile>

            <RoomTile highlighted={activeRoomKey === 'bath'}>
              <View style={styles.bathSinkTop} />
              <View style={styles.bathSinkStem} />
              <View style={styles.bathSinkPipe} />
              <View style={styles.toiletTop} />
              <View style={styles.toiletBase} />
              {activeRoomKey === 'bath' ? (
                <RoomRequestBubble
                  label={FIXTURE_NAMES[1]}
                  subtitle={activeNeedLabel}
                />
              ) : null}
            </RoomTile>

            <RoomTile highlighted={activeRoomKey === 'kitchen'}>
              <View style={styles.counter} />
              <View style={styles.cabinet} />
              <View style={styles.sink} />
              <View style={styles.faucet} />
              <View style={styles.windowGlow} />
              {activeRoomKey === 'kitchen' ? (
                <RoomRequestBubble
                  label={FIXTURE_NAMES[0]}
                  subtitle={activeNeedLabel}
                />
              ) : null}
            </RoomTile>
          </View>

          <View style={styles.floorDivider} />

          <View style={styles.bottomFloor}>
            <RoomTile>
              <View style={styles.bookshelf} />
              <View style={styles.plantPot} />
              <View style={styles.plantLeafLeft} />
              <View style={styles.plantLeafRight} />
            </RoomTile>

            <RoomTile>
              <View style={styles.armchairBack} />
              <View style={styles.armchairSeat} />
              <View style={styles.rug} />
            </RoomTile>

            <RoomTile highlighted={activeRoomKey === 'laundry'}>
              <View style={styles.laundryCounter} />
              <View style={styles.laundryCabinet} />
              <View style={styles.laundrySink} />
              <View style={styles.bucket} />
              {activeRoomKey === 'laundry' ? (
                <RoomRequestBubble
                  label={FIXTURE_NAMES[2]}
                  subtitle={activeNeedLabel}
                />
              ) : null}
            </RoomTile>
          </View>
        </View>
      </View>
    </View>
  );
}

function RoomTile({
  children,
  highlighted = false,
}: {
  children: ReactNode;
  highlighted?: boolean;
}) {
  return (
    <View style={[styles.roomTile, highlighted && styles.roomTileHighlighted]}>
      <View style={styles.wallTone} />
      <View style={styles.floorTone} />
      {children}
    </View>
  );
}

function RoomRequestBubble({
  label,
  subtitle,
}: {
  label: string;
  subtitle: string;
}) {
  return (
    <View style={styles.requestBubbleWrap}>
      <View style={styles.requestBubbleTail} />
      <View style={styles.requestBubble}>
        <LoopAvatar size={34} variant="customer" />
        <View style={styles.requestTextWrap}>
          <Text numberOfLines={1} style={styles.requestLabel}>
            {label}
          </Text>
          <Text numberOfLines={1} style={styles.requestSubtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: '100%',
    marginBottom: 14,
  },
  hudRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  needChip: {
    flex: 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#D39748',
    backgroundColor: '#F7D88C',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  fixtureChip: {
    flex: 1.15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#D39748',
    backgroundColor: '#F7D88C',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  fixtureChipExpired: {
    backgroundColor: '#E4A67B',
    borderColor: '#C96B45',
  },
  chipContent: {
    flex: 1,
    marginLeft: 8,
  },
  chipLabel: {
    color: '#7B5229',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  chipValue: {
    color: '#4C311B',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  fixtureValue: {
    color: '#23426E',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  trackWarm: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8D6E2E',
    overflow: 'hidden',
  },
  trackCool: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4A6933',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: '#63C84F',
  },
  houseScene: {
    overflow: 'hidden',
    borderRadius: 30,
    paddingTop: 24,
  },
  skyBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 190,
    backgroundColor: '#8FBDE2',
  },
  sunGlow: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: '#FFD664',
  },
  cloudOne: {
    position: 'absolute',
    top: 32,
    left: 14,
    width: 70,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8F2E4',
  },
  cloudTwo: {
    position: 'absolute',
    top: 52,
    left: 56,
    width: 42,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#F8F2E4',
  },
  roofLine: {
    position: 'absolute',
    top: 20,
    left: 78,
    right: 78,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#A25030',
  },
  roofPeak: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#8C4126',
  },
  houseFrame: {
    borderRadius: 30,
    borderWidth: 6,
    borderColor: '#F5EEDB',
    backgroundColor: '#F2E5C7',
    overflow: 'hidden',
  },
  topFloor: {
    flexDirection: 'row',
    backgroundColor: '#F1D7A0',
  },
  bottomFloor: {
    flexDirection: 'row',
    backgroundColor: '#F0D8A7',
  },
  floorDivider: {
    height: 22,
    backgroundColor: '#F8F2E2',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#D9C8A7',
  },
  roomTile: {
    flex: 1,
    height: 172,
    borderRightWidth: 2,
    borderColor: '#DFC58F',
    paddingHorizontal: 10,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  roomTileHighlighted: {
    backgroundColor: 'rgba(255, 246, 217, 0.42)',
  },
  wallTone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  floorTone: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 18,
    height: 16,
    backgroundColor: 'rgba(160, 116, 57, 0.08)',
  },
  sofaBack: {
    position: 'absolute',
    left: 20,
    bottom: 66,
    width: 86,
    height: 44,
    borderRadius: 18,
    backgroundColor: '#BE6B43',
  },
  sofaSeat: {
    position: 'absolute',
    left: 12,
    bottom: 28,
    width: 102,
    height: 40,
    borderRadius: 18,
    backgroundColor: '#B55D39',
  },
  blanket: {
    position: 'absolute',
    left: 34,
    bottom: 50,
    width: 24,
    height: 70,
    borderRadius: 14,
    backgroundColor: '#86B6CF',
    transform: [{ rotate: '18deg' }],
  },
  bathSinkTop: {
    position: 'absolute',
    top: 56,
    left: 30,
    width: 60,
    height: 18,
    borderRadius: 8,
    backgroundColor: '#F4F1EB',
  },
  bathSinkStem: {
    position: 'absolute',
    top: 70,
    left: 50,
    width: 18,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#EAE4DB',
  },
  bathSinkPipe: {
    position: 'absolute',
    top: 44,
    left: 58,
    width: 12,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#CDD3D4',
  },
  toiletTop: {
    position: 'absolute',
    top: 84,
    right: 20,
    width: 36,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#F3EFE9',
  },
  toiletBase: {
    position: 'absolute',
    top: 98,
    right: 16,
    width: 44,
    height: 54,
    borderRadius: 20,
    backgroundColor: '#ECE7DF',
  },
  counter: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 56,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#D79D47',
  },
  cabinet: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 20,
    height: 40,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#D68D2F',
  },
  sink: {
    position: 'absolute',
    right: 28,
    bottom: 88,
    width: 44,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#F4F0E8',
  },
  faucet: {
    position: 'absolute',
    right: 42,
    bottom: 100,
    width: 10,
    height: 18,
    borderRadius: 5,
    backgroundColor: '#CED4D4',
  },
  windowGlow: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 68,
    height: 92,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 243, 187, 0.22)',
  },
  bookshelf: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    width: 72,
    height: 92,
    borderRadius: 14,
    backgroundColor: '#745743',
  },
  plantPot: {
    position: 'absolute',
    left: 14,
    bottom: 18,
    width: 28,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#B66D33',
  },
  plantLeafLeft: {
    position: 'absolute',
    left: 20,
    bottom: 38,
    width: 26,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#609441',
    transform: [{ rotate: '-18deg' }],
  },
  plantLeafRight: {
    position: 'absolute',
    left: 44,
    bottom: 54,
    width: 30,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#80B652',
    transform: [{ rotate: '14deg' }],
  },
  armchairBack: {
    position: 'absolute',
    left: 22,
    bottom: 76,
    width: 88,
    height: 52,
    borderRadius: 22,
    backgroundColor: '#E7D6AF',
  },
  armchairSeat: {
    position: 'absolute',
    left: 14,
    bottom: 42,
    width: 104,
    height: 42,
    borderRadius: 20,
    backgroundColor: '#E2CDA4',
  },
  rug: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 18,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#88BFD3',
  },
  laundryCounter: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 48,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#C57D30',
  },
  laundryCabinet: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 38,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#AE702F',
  },
  laundrySink: {
    position: 'absolute',
    left: 36,
    bottom: 74,
    width: 46,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#F2EEE7',
  },
  bucket: {
    position: 'absolute',
    right: 22,
    bottom: 18,
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: '#D0CABF',
  },
  requestBubbleWrap: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'center',
  },
  requestBubbleTail: {
    width: 10,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#FFF8EA',
    marginBottom: -4,
    zIndex: 1,
  },
  requestBubble: {
    minWidth: 114,
    maxWidth: 136,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 18,
    backgroundColor: '#FFF3C3',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  requestTextWrap: {
    flex: 1,
  },
  requestLabel: {
    color: '#4D341F',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
  requestSubtitle: {
    color: '#8B6B45',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
});
