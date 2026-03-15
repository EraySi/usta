import { PlaceholderScreen } from './PlaceholderScreen';
import type { ScreenProps } from './types';

export function WinScreen({ navigate }: ScreenProps) {
  return (
    <PlaceholderScreen
      title="You Win"
      subtitle="This is the placeholder success screen."
      actions={[
        { label: 'Play Again', screen: 'game' },
        { label: 'Back Home', screen: 'home' },
      ]}
      navigate={navigate}
    />
  );
}
