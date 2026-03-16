import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AvailablePiece } from '../game/models/level';
import { createDefaultPipe, type PipeType } from '../game/models/pipes';
import { PipePreview } from './PipePreview';

type PipeTrayProps = {
  availablePieces: AvailablePiece[];
  selectedPipeType: PipeType | null;
  onSelectPipeType: (pipeType: PipeType | null) => void;
};

export function PipeTray({
  availablePieces,
  selectedPipeType,
  onSelectPipeType,
}: PipeTrayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pipe Tray</Text>
      <Text style={styles.subtitle}>Tap a pipe, then tap an empty cell.</Text>

      <View style={styles.row}>
        {availablePieces.map((piece) => {
          const isSelected = selectedPipeType === piece.type;
          const isDisabled = piece.count === 0;

          return (
            <Pressable
              key={piece.type}
              disabled={isDisabled}
              onPress={() =>
                onSelectPipeType(isSelected ? null : piece.type)
              }
              style={[
                styles.pieceButton,
                isSelected && styles.selectedPieceButton,
                isDisabled && styles.disabledPieceButton,
              ]}
            >
              <View style={styles.previewWrap}>
                <PipePreview pipe={createDefaultPipe(piece.type)} />
              </View>
              <Text style={styles.pieceName}>{piece.type}</Text>
              <Text style={styles.pieceCount}>x{piece.count}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 20,
  },
  title: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  pieceButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  selectedPieceButton: {
    borderColor: '#111111',
    backgroundColor: '#F3F4F6',
  },
  disabledPieceButton: {
    opacity: 0.45,
  },
  previewWrap: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  pieceName: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  pieceCount: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
  },
});
