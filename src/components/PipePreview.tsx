import { StyleSheet, Text, View } from 'react-native';

import type { PipeModel, PipeType } from '../game/models/pipes';

type PipePreviewProps = {
  pipe: PipeModel | null;
};

const PIPE_SYMBOLS: Record<PipeType, string> = {
  straight: 'I',
  corner: 'L',
  tee: 'T',
};

const PIPE_COLORS: Record<PipeType, string> = {
  straight: '#2D6CDF',
  corner: '#D97706',
  tee: '#059669',
};

export function PipePreview({ pipe }: PipePreviewProps) {
  if (!pipe) {
    return <View style={styles.emptyMarker} />;
  }

  return (
    <View
      style={[
        styles.token,
        {
          borderColor: PIPE_COLORS[pipe.type],
          backgroundColor: `${PIPE_COLORS[pipe.type]}1A`,
        },
      ]}
    >
      <Text style={[styles.symbol, { color: PIPE_COLORS[pipe.type] }]}>
        {PIPE_SYMBOLS[pipe.type]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    width: '70%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
  },
  symbol: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyMarker: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
});
