import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function HomeScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="Home"
      subtitle="Welcome to Yetis Ustam."
      actions={[
        { label: 'Select Level', screen: 'levelSelect' },
        { label: 'Start Game', screen: 'game' },
      ]}
      navigate={navigate}
    />
  );
}
