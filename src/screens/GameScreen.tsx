import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function GameScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="Game"
      subtitle="Gameplay will be added later. Use these actions to test the flow."
      actions={[
        { label: 'Simulate Win', screen: 'win' },
        { label: 'Simulate Lose', screen: 'lose' },
      ]}
      navigate={navigate}
    />
  );
}
