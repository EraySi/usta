import { StyleSheet, View } from 'react-native';

import {
  getPipeConnections,
  type Direction,
  type PipeModel,
} from '../game/models/pipes';

type PipePreviewProps = {
  pipe: PipeModel | null;
  variant?: 'board' | 'tray';
};

const PIPE_COLORS = {
  straight: {
    core: '#2D72BC',
    edge: '#8BC0EA',
    shadow: '#1A4675',
  },
  corner: {
    core: '#D88733',
    edge: '#F1C98E',
    shadow: '#97541D',
  },
  tee: {
    core: '#4C4846',
    edge: '#B7B1A9',
    shadow: '#2D2928',
  },
} as const;

const CAP_COLORS = {
  body: '#D7D4CD',
  edge: '#FAFAF7',
  shadow: '#98938B',
} as const;

export function PipePreview({ pipe, variant = 'board' }: PipePreviewProps) {
  if (!pipe) {
    return <View style={variant === 'tray' ? styles.trayMarker : styles.boardMarker} />;
  }

  const connections = getPipeConnections(pipe);
  const colors = PIPE_COLORS[pipe.type];

  return (
    <View style={[styles.base, variant === 'tray' ? styles.trayBase : styles.boardBase]}>
      {connections.map((direction) => (
        <PipeArm
          key={direction}
          color={colors.core}
          direction={direction}
          edgeColor={colors.edge}
          shadowColor={colors.shadow}
        />
      ))}

      {connections.map((direction) => (
        <PipeCap key={`${direction}-cap`} direction={direction} />
      ))}

      <View style={[styles.jointShadow, { backgroundColor: colors.shadow }]} />
      <View style={[styles.joint, { backgroundColor: colors.core }]}>
        <View style={[styles.jointHighlight, { backgroundColor: colors.edge }]} />
      </View>
    </View>
  );
}

type PipeArmProps = {
  color: string;
  direction: Direction;
  edgeColor: string;
  shadowColor: string;
};

function PipeArm({ color, direction, edgeColor, shadowColor }: PipeArmProps) {
  return (
    <View
      style={[
        styles.arm,
        ARM_POSITIONS[direction],
        {
          backgroundColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.armShadow,
          ARM_SHADOWS[direction],
          { backgroundColor: shadowColor },
        ]}
      />
      <View
        style={[
          styles.armHighlight,
          ARM_HIGHLIGHTS[direction],
          { backgroundColor: edgeColor },
        ]}
      />
    </View>
  );
}

function PipeCap({ direction }: { direction: Direction }) {
  return (
    <View style={[styles.cap, CAP_POSITIONS[direction]]}>
      <View style={[styles.capShadow, CAP_SHADOWS[direction]]} />
      <View style={[styles.capInner, CAP_INNERS[direction]]}>
        <View style={[styles.capHighlight, CAP_HIGHLIGHTS[direction]]} />
      </View>
    </View>
  );
}

const ARM_POSITIONS = StyleSheet.create({
  up: {
    top: 8,
    left: 23,
    width: 18,
    height: 24,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  right: {
    top: 23,
    right: 8,
    width: 24,
    height: 18,
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
  down: {
    bottom: 8,
    left: 23,
    width: 18,
    height: 24,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
  },
  left: {
    top: 23,
    left: 8,
    width: 24,
    height: 18,
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
});

const ARM_SHADOWS = StyleSheet.create({
  up: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  right: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
  },
  down: {
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  left: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 4,
  },
});

const ARM_HIGHLIGHTS = StyleSheet.create({
  up: {
    top: 2,
    left: 3,
    right: 3,
    height: 3,
    borderRadius: 3,
  },
  right: {
    top: 3,
    right: 2,
    bottom: 3,
    width: 3,
    borderRadius: 3,
  },
  down: {
    bottom: 2,
    left: 3,
    right: 3,
    height: 3,
    borderRadius: 3,
  },
  left: {
    top: 3,
    left: 2,
    bottom: 3,
    width: 3,
    borderRadius: 3,
  },
});

const CAP_POSITIONS = StyleSheet.create({
  up: {
    top: 2,
    left: 20,
    width: 24,
    height: 10,
  },
  right: {
    top: 20,
    right: 2,
    width: 10,
    height: 24,
  },
  down: {
    bottom: 2,
    left: 20,
    width: 24,
    height: 10,
  },
  left: {
    top: 20,
    left: 2,
    width: 10,
    height: 24,
  },
});

const CAP_INNERS = StyleSheet.create({
  up: {
    width: '100%',
    height: 8,
    borderRadius: 5,
  },
  right: {
    width: 8,
    height: '100%',
    borderRadius: 5,
  },
  down: {
    width: '100%',
    height: 8,
    borderRadius: 5,
  },
  left: {
    width: 8,
    height: '100%',
    borderRadius: 5,
  },
});

const CAP_SHADOWS = StyleSheet.create({
  up: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    borderRadius: 3,
    backgroundColor: CAP_COLORS.shadow,
  },
  right: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
    backgroundColor: CAP_COLORS.shadow,
  },
  down: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    borderRadius: 3,
    backgroundColor: CAP_COLORS.shadow,
  },
  left: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
    backgroundColor: CAP_COLORS.shadow,
  },
});

const CAP_HIGHLIGHTS = StyleSheet.create({
  up: {
    position: 'absolute',
    top: 1,
    left: 3,
    right: 3,
    height: 2,
    borderRadius: 2,
  },
  right: {
    position: 'absolute',
    top: 3,
    right: 1,
    bottom: 3,
    width: 2,
    borderRadius: 2,
  },
  down: {
    position: 'absolute',
    bottom: 1,
    left: 3,
    right: 3,
    height: 2,
    borderRadius: 2,
  },
  left: {
    position: 'absolute',
    top: 3,
    left: 1,
    bottom: 3,
    width: 2,
    borderRadius: 2,
  },
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardBase: {
    width: 60,
    height: 60,
  },
  trayBase: {
    width: 60,
    height: 60,
    transform: [{ scale: 0.94 }],
  },
  arm: {
    position: 'absolute',
    overflow: 'hidden',
  },
  armShadow: {
    position: 'absolute',
  },
  armHighlight: {
    position: 'absolute',
  },
  cap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capShadow: {
    position: 'absolute',
  },
  capInner: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CAP_COLORS.body,
  },
  capHighlight: {
    backgroundColor: CAP_COLORS.edge,
  },
  jointShadow: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    top: 20,
    left: 20,
  },
  joint: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  jointHighlight: {
    width: 18,
    height: 4,
    borderRadius: 3,
    marginTop: 3,
  },
  boardMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E4D3B2',
  },
  trayMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D6C09A',
  },
});
