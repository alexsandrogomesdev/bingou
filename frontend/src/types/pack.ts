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
export interface ModalitiesInterface {
  id: number;
  on: boolean;
  name: string;
  maps: Array<number[]>;
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
    goods: Goods[];
    winnings: Winnings[];
    modalities: ModalitiesInterface[];
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
  modalities?: ModalitiesInterface[];
  goods?: Goods[];
  winnings?: Winnings[];
}

export interface Goods {
  ball: number;
  modality: string;
  card: number;
}
