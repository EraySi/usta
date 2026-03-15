import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function LevelSelectScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="Level Select"
      subtitle="Choose a placeholder level to continue."
      actions={[
        { label: 'Play Level 1', screen: 'game' },
        { label: 'Back Home', screen: 'home' },
      ]}
      navigate={navigate}
    />
  );
}
