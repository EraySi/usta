import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function LoseScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="Bölüm Bitti"
      subtitle="Süre doldu. Tekrar deneyebilirsin."
      actions={[
        { label: 'Tekrar Dene', screen: 'game' },
        { label: 'Ana Sayfa', screen: 'home' },
      ]}
      navigate={navigate}
    />
  );
}
