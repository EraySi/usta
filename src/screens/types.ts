export type AppScreen = 'home' | 'levelSelect' | 'game' | 'win' | 'lose';

export type Navigate = (screen: AppScreen) => void;

export type ScreenProps = {
  navigate: Navigate;
};
