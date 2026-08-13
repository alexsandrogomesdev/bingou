export interface Cards {
  id: number;
  numbers: {
    data: number[];
  };
}
export interface AllModalities {
  id: number;
  name: string;
  map: Array<number[]>;
}

export interface CardWinningObject {
  id: number;
  numbers: number[];
  pattern: number[];
}
export interface WinningsObject {
  modality: {
    id: number;
    name: string;
  };
  cards: CardWinningObject[];
}
export interface Winnings {
  ball: number;
  winnings: WinningsObject[];
}

export interface PackType {
  message: string;
  result: {
    cards: Cards[];
    name: string;
    balls: {
      data: number[];
    };
    winnings: Winnings[];
    modalities: {
      data: number[];
    };
    allModalities: [];
  };
}
export interface CardsOnModality {
  modality: object;
  cards: Array<{
    card: {
      id: number;
      pattern: number[];
      numbers: number[];
    };
  }>;
}
export interface BodyUpdatePack {
  balls?: number[];
  modalities?: number[];
  winnings?: Winnings[];
}
