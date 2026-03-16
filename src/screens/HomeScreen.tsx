import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function HomeScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="Yetis Ustam"
      subtitle="Hazırsan tesisata başlayalım."
      actions={[
        { label: 'Bölüm Seç', screen: 'levelSelect' },
        { label: 'Oyuna Başla', screen: 'game' },
      ]}
      navigate={navigate}
    />
  );
}
