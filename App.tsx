import { useState } from 'react';

import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { LoseScreen } from './src/screens/LoseScreen';
import type { AppScreen } from './src/screens/types';
import { WinScreen } from './src/screens/WinScreen';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');

  switch (screen) {
    case 'levelSelect':
      return <LevelSelectScreen navigate={setScreen} />;
    case 'game':
      return <GameScreen navigate={setScreen} />;
    case 'win':
      return <WinScreen navigate={setScreen} />;
    case 'lose':
      return <LoseScreen navigate={setScreen} />;
    case 'home':
    default:
      return <HomeScreen navigate={setScreen} />;
  }
}
