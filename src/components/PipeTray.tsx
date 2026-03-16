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
      <View style={styles.trayLip} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alet Kutusu</Text>
          <Text style={styles.subtitle}>Bir boru seç, sonra tahtaya yerleştir.</Text>
        </View>
        <View style={styles.selectionBadge}>
          <Text style={styles.selectionLabel}>
            {selectedPipeType ? 'Hazır' : 'Seç'}
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
              <View style={styles.previewStage}>
                <View style={styles.previewGlow} />
                <PipePreview pipe={createDefaultPipe(piece.type)} variant="tray" />
              </View>
              <Text style={styles.pieceName}>{getPipeLabel(piece.type)}</Text>
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#A56E2F',
    backgroundColor: '#D99845',
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 14,
    shadowColor: '#7A4D1D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  trayLip: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    width: 72,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F2CA88',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: '#FFF4E0',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: '#FBE1B8',
    fontSize: 13,
    lineHeight: 18,
  },
  selectionBadge: {
    borderRadius: 18,
    backgroundColor: '#F9E7C1',
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
    gap: 12,
  },
  pieceButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#BE8740',
    backgroundColor: '#F2CF91',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  selectedPieceButton: {
    borderColor: '#173042',
    backgroundColor: '#FFF2D2',
  },
  disabledPieceButton: {
    opacity: 0.45,
  },
  previewStage: {
    width: 74,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  previewGlow: {
    position: 'absolute',
    width: 64,
    height: 42,
    borderRadius: 22,
    backgroundColor: '#F8E8C6',
  },
  pieceName: {
    color: '#5B4126',
    fontSize: 14,
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

function getPipeLabel(pipeType: PipeType): string {
  switch (pipeType) {
    case 'straight':
      return 'Düz';
    case 'corner':
      return 'Dirsek';
    case 'tee':
      return 'T Boru';
    default:
      return pipeType;
  }
}
