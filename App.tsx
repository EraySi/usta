import { useState } from 'react';

import { WORLD_1_LEVELS } from './src/game/data';
import { GameScreen } from './src/screens/GameScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { LoseScreen } from './src/screens/LoseScreen';
import type { AppScreen } from './src/screens/types';
import { WinScreen } from './src/screens/WinScreen';
import type { LevelWinResult } from './src/game/models/scoring';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(
    WORLD_1_LEVELS[0]?.id ?? null,
  );
  const [lastWinResult, setLastWinResult] = useState<LevelWinResult | null>(null);

  switch (screen) {
    case 'levelSelect':
      return (
        <LevelSelectScreen
          navigate={setScreen}
          selectedLevelId={selectedLevelId}
          onSelectLevel={setSelectedLevelId}
        />
      );
    case 'game':
      return (
        <GameScreen
          levelId={selectedLevelId}
          navigate={setScreen}
          onWinLevel={setLastWinResult}
        />
      );
    case 'win':
      return <WinScreen navigate={setScreen} result={lastWinResult} />;
    case 'lose':
      return <LoseScreen navigate={setScreen} />;
    case 'home':
    default:
      return <HomeScreen navigate={setScreen} />;
  }
}
