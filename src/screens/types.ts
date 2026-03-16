export type AppScreen = 'home' | 'levelSelect' | 'game' | 'win' | 'lose';

export type Navigate = (screen: AppScreen) => void;

export type ScreenProps = {
  navigate: Navigate;
};

export type LevelSelectScreenProps = ScreenProps & {
  selectedLevelId: string | null;
  onSelectLevel: (levelId: string) => void;
};

export type GameScreenProps = ScreenProps & {
  levelId: string | null;
};
