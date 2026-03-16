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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Toolbox</Text>
          <Text style={styles.subtitle}>Pick a pipe piece and drop it onto the board.</Text>
        </View>
        <View style={styles.selectionBadge}>
          <Text style={styles.selectionLabel}>
            {selectedPipeType ? 'Ready' : 'Choose'}
          </Text>
        </View>
      </View>

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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#CDAF7A',
    backgroundColor: '#E8B769',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: '#93652D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: '#533618',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#734D28',
    fontSize: 13,
    lineHeight: 18,
  },
  selectionBadge: {
    borderRadius: 16,
    backgroundColor: '#F6DCA9',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectionLabel: {
    color: '#72491D',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  pieceButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#D3AF71',
    backgroundColor: '#FAE6BC',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  selectedPieceButton: {
    borderColor: '#173042',
    backgroundColor: '#FFF8EA',
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
    color: '#5B4126',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  pieceCount: {
    color: '#8A6D49',
    fontSize: 12,
    fontWeight: '700',
  },
});
