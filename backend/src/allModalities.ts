/*
CARD STRUCTURE

0   5   10    15    20
1   6   11    16    21
2   7   12    17    22
3   8   13    18    23
4   9   14    19    24

*/

export interface Modalities {
  id: number;
  on: boolean;
  name: string;
  maps: Array<number[]>;
}
export const allModalities: Modalities[] = [
  {
    id: 1,
    on: false,
    name: "Cheia",
    maps: [
      [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24,
      ],
    ],
  },
  {
    id: 2,
    on: false,
    name: "Quina",
    maps: [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],

      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
    ],
  },
  {
    id: 3,
    on: false,
    name: "Coluna",
    maps: [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9],
      [10, 11, 13, 14],
      [15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24],
    ],
  },
  {
    id: 4,
    on: false,
    name: "Linha",
    maps: [
      [0, 5, 10, 15, 20],
      [1, 6, 11, 16, 21],
      [2, 7, 17, 22],
      [3, 8, 13, 18, 23],
      [4, 9, 14, 19, 24],
    ],
  },
  {
    id: 5,
    on: false,
    name: "4 Selos de Canto",
    maps: [[0, 1, 3, 4, 5, 6, 8, 9, 15, 16, 18, 19, 20, 21, 23, 24]],
  },
  {
    id: 6,
    on: false,
    name: "4 Curvas",
    maps: [[0, 1, 3, 4, 5, 9, 15, 19, 20, 21, 23, 24]],
  },
  {
    id: 7,
    on: false,
    name: "BIN ou NGO",
    maps: [
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14],
      [10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    ],
  },
  {
    id: 8,
    on: false,
    name: "Martelo",
    maps: [[0, 1, 5, 6, 10, 11, 13, 14, 15, 16, 20, 21]],
  },
  {
    id: 9,
    on: false,
    name: "Cacto",
    maps: [[0, 1, 2, 7, 10, 11, 13, 14, 17, 20, 21, 22]],
  },
  {
    id: 10,
    on: false,
    name: "Quadro Grande",
    maps: [[0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24]],
  },
  {
    id: 11,
    on: false,
    name: "Quadro Pequeno",
    maps: [[6, 7, 8, 11, 13, 16, 17, 18]],
  },
  {
    id: 12,
    on: false,
    name: "Tabuleiro de damas",
    maps: [[0, 2, 4, 6, 8, 10, 14, 16, 18, 20, 22, 24]],
  },
  {
    id: 13,
    on: false,
    name: "4 Cantos",
    maps: [[0, 4, 20, 24]],
  },
  {
    id: 14,
    on: false,
    name: "Cruz",
    maps: [[2, 7, 10, 11, 13, 14, 17, 22]],
  },
  {
    id: 15,
    on: false,
    name: "Bolo de 3 camadas",
    maps: [[0, 2, 4, 5, 7, 9, 10, 14, 15, 17, 19, 20, 22, 24]],
  },
];
