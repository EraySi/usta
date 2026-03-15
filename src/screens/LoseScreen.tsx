import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function LoseScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="You Lose"
      subtitle="This is the placeholder failure screen."
      actions={[
        { label: 'Try Again', screen: 'game' },
        { label: 'Back Home', screen: 'home' },
      ]}
      navigate={navigate}
    />
  );
}
