import { StyleSheet, View } from 'react-native';

import { getPipeConnections, type Direction, type PipeModel } from '../game/models/pipes';

type PipePreviewProps = {
  pipe: PipeModel | null;
  variant?: 'board' | 'tray';
};

const PIPE_COLORS = {
  straight: {
    core: '#2B6FB6',
    edge: '#81B7E6',
    shadow: '#17406B',
  },
  corner: {
    core: '#D57E2E',
    edge: '#F4C98A',
    shadow: '#94511A',
  },
  tee: {
    core: '#54504D',
    edge: '#B8B3AD',
    shadow: '#2E2A28',
  },
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

      <View style={[styles.jointShadow, { backgroundColor: colors.shadow }]} />
      <View style={[styles.joint, { backgroundColor: colors.core }]}>
        <View style={[styles.highlight, { backgroundColor: colors.edge }]} />
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
      <View style={[styles.armShadow, ARM_SHADOWS[direction], { backgroundColor: shadowColor }]} />
      <View style={[styles.armHighlight, ARM_HIGHLIGHTS[direction], { backgroundColor: edgeColor }]} />
    </View>
  );
}

const ARM_POSITIONS = StyleSheet.create({
  up: {
    top: 10,
    left: 22,
    width: 16,
    height: 22,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  right: {
    top: 22,
    right: 10,
    width: 22,
    height: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  down: {
    bottom: 10,
    left: 22,
    width: 16,
    height: 22,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  left: {
    top: 22,
    left: 10,
    width: 22,
    height: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
});

const ARM_SHADOWS = StyleSheet.create({
  up: {
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  right: {
    top: 0,
    left: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  down: {
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  left: {
    top: 0,
    right: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
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

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardBase: {
    width: 52,
    height: 52,
  },
  trayBase: {
    width: 52,
    height: 52,
    transform: [{ scale: 0.82 }],
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
  jointShadow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    top: 19,
    left: 19,
  },
  joint: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  highlight: {
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
