import { StyleSheet, Text, View } from 'react-native';

type HouseTarget = {
  id: string;
  isActive: boolean;
};

type HouseViewProps = {
  activeNeedLabel: string;
  activeTargetId: string | null;
  countdownLabel: string;
  isExpired: boolean;
  targets: HouseTarget[];
};

const FIXTURE_NAMES = ['Kitchen Sink', 'Bathroom Tub', 'Laundry Tap'];

export function HouseView({
  activeNeedLabel,
  activeTargetId,
  countdownLabel,
  isExpired,
  targets,
}: HouseViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sunGlow} />
      <View style={styles.cloudLarge} />
      <View style={styles.cloudSmall} />

      <View style={styles.headerRow}>
        <View style={styles.storyBubble}>
          <Text style={styles.storyLabel}>House Call</Text>
          <Text style={styles.storyText}>
            Usta needs a clean water route to the right room.
          </Text>
        </View>

        <View style={[styles.timerBubble, isExpired && styles.timerBubbleExpired]}>
          <Text style={styles.timerLabel}>Rush</Text>
          <Text style={styles.timerValue}>{countdownLabel}</Text>
        </View>
      </View>

      <View style={styles.houseFrame}>
        <View style={styles.roof}>
          <View style={styles.roofTileLeft} />
          <View style={styles.roofTileRight} />
        </View>

        <View style={styles.houseBody}>
          <View style={styles.targetRow}>
            {targets.map((target, index) => (
              <RoomTarget
                key={target.id}
                fixtureName={FIXTURE_NAMES[index] ?? `Room ${index + 1}`}
                isActive={target.isActive}
                roomNumber={index + 1}
              />
            ))}
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.characterArea}>
              <View style={styles.characterHead}>
                <View style={styles.characterHat} />
                <View style={styles.characterFace}>
                  <View style={styles.eye} />
                  <View style={styles.eye} />
                </View>
              </View>

              <View style={styles.dialogBubble}>
                <Text style={styles.dialogLabel}>Current Need</Text>
                <Text style={styles.dialogTitle}>{activeNeedLabel}</Text>
                <Text style={styles.dialogText}>
                  Send water to {formatTargetLabel(activeTargetId, targets)} before time runs out.
                </Text>
              </View>
            </View>

            <View style={styles.pipeWall}>
              <Text style={styles.pipeWallLabel}>Pipe Line</Text>
              <View style={styles.pipeColumn}>
                <View style={styles.pipeSegment} />
                <View style={styles.pipeJoint} />
                <View style={styles.pipeSegmentTall} />
              </View>
              <View style={styles.pipeOutlet}>
                <View style={styles.pipeOutletRing} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

type RoomTargetProps = {
  fixtureName: string;
  isActive: boolean;
  roomNumber: number;
};

function RoomTarget({ fixtureName, isActive, roomNumber }: RoomTargetProps) {
  return (
    <View style={[styles.room, isActive && styles.roomActive]}>
      <Text style={[styles.roomNumber, isActive && styles.roomNumberActive]}>
        Room {roomNumber}
      </Text>

      <View style={styles.fixtureStage}>
        <View style={styles.fixtureTap} />
        <View style={styles.fixturePipe} />
        <View style={[styles.fixtureBase, isActive && styles.fixtureBaseActive]} />
      </View>

      <Text style={[styles.fixtureName, isActive && styles.fixtureNameActive]}>
        {fixtureName}
      </Text>
      <Text style={[styles.fixtureHint, isActive && styles.fixtureHintActive]}>
        {isActive ? 'Needs water now' : 'Waiting'}
      </Text>
    </View>
  );
}

function formatTargetLabel(
  activeTargetId: string | null,
  targets: HouseTarget[],
): string {
  if (!activeTargetId) {
    return 'the highlighted room';
  }

  const targetIndex = targets.findIndex((target) => target.id === activeTargetId);

  if (targetIndex === -1) {
    return activeTargetId;
  }

  return FIXTURE_NAMES[targetIndex] ?? `Room ${targetIndex + 1}`;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#F7EFD9',
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 18,
    marginBottom: 18,
    overflow: 'hidden',
  },
  sunGlow: {
    position: 'absolute',
    top: -26,
    right: -16,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#FFD978',
  },
  cloudLarge: {
    position: 'absolute',
    top: 20,
    left: 18,
    width: 54,
    height: 18,
    borderRadius: 12,
    backgroundColor: '#FFF7E8',
  },
  cloudSmall: {
    position: 'absolute',
    top: 34,
    left: 58,
    width: 28,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#FFF7E8',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  storyBubble: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#FFF8EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  storyLabel: {
    color: '#9D7142',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  storyText: {
    color: '#5E4330',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  timerBubble: {
    minWidth: 90,
    borderRadius: 20,
    backgroundColor: '#CC7652',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  timerBubbleExpired: {
    backgroundColor: '#A53A2F',
  },
  timerLabel: {
    color: '#FFEBD4',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  timerValue: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  houseFrame: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#E4C59A',
  },
  roof: {
    height: 32,
    backgroundColor: '#BB6545',
    justifyContent: 'center',
  },
  roofTileLeft: {
    position: 'absolute',
    left: 26,
    width: 86,
    height: 10,
    borderRadius: 8,
    backgroundColor: '#D88662',
  },
  roofTileRight: {
    position: 'absolute',
    right: 26,
    width: 76,
    height: 10,
    borderRadius: 8,
    backgroundColor: '#D88662',
  },
  houseBody: {
    backgroundColor: '#F2DFC1',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 14,
  },
  targetRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  room: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#FFF8EC',
    borderWidth: 2,
    borderColor: '#D7B689',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  roomActive: {
    backgroundColor: '#F7FFF6',
    borderColor: '#5CA47D',
  },
  roomNumber: {
    color: '#916A42',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  roomNumberActive: {
    color: '#215F44',
  },
  fixtureStage: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 14,
    backgroundColor: '#F3E4CB',
  },
  fixtureTap: {
    width: 22,
    height: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    backgroundColor: '#8FAAB4',
    marginBottom: 4,
  },
  fixturePipe: {
    width: 8,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#8FAAB4',
    marginBottom: 4,
  },
  fixtureBase: {
    width: 30,
    height: 12,
    borderRadius: 8,
    backgroundColor: '#D9C1A1',
  },
  fixtureBaseActive: {
    backgroundColor: '#99D0B0',
  },
  fixtureName: {
    color: '#4B3526',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  fixtureNameActive: {
    color: '#1E5D41',
  },
  fixtureHint: {
    color: '#9B7A5B',
    fontSize: 11,
    marginTop: 4,
  },
  fixtureHintActive: {
    color: '#347455',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  characterArea: {
    flex: 1.35,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  characterHead: {
    width: 74,
    alignItems: 'center',
  },
  characterHat: {
    width: 50,
    height: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#C16A49',
    marginBottom: -2,
    zIndex: 1,
  },
  characterFace: {
    width: 62,
    height: 66,
    borderRadius: 30,
    backgroundColor: '#F7D7AB',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5B4126',
  },
  dialogBubble: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#FFF8EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dialogLabel: {
    color: '#8D6844',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dialogTitle: {
    color: '#4C3524',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  dialogText: {
    color: '#6F5640',
    fontSize: 13,
    lineHeight: 18,
  },
  pipeWall: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#E8D2AD',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pipeWallLabel: {
    color: '#8A6641',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pipeColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pipeSegment: {
    width: 12,
    height: 18,
    borderRadius: 6,
    backgroundColor: '#5C8FA0',
  },
  pipeJoint: {
    width: 24,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5C8FA0',
    marginVertical: 4,
  },
  pipeSegmentTall: {
    width: 12,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#5C8FA0',
  },
  pipeOutlet: {
    marginTop: 8,
    width: 38,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8E9CE',
  },
  pipeOutletRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    borderColor: '#5C8FA0',
  },
});
