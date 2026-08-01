import { shuffleArray, getRandomNumber } from "../utils";

export const createCardNumbers = (base: number[]): Uint8Array => {
  let newBase = shuffleArray([...base]);

  const B: number[] = [];
  const I: number[] = [];
  const N: number[] = [];
  const G: number[] = [];
  const O: number[] = [];

  while (newBase.length > 51) {
    const number = newBase[getRandomNumber(0, newBase.length - 1)]!;
    if (number >= 1 && number <= 15 && B.length <= 4) {
      B.push(number);
    } else if (number >= 16 && number <= 30 && I.length <= 4) {
      I.push(number);
    } else if (number >= 31 && number <= 45 && N.length <= 3) {
      N.push(number);
    } else if (number >= 46 && number <= 60 && G.length <= 4) {
      G.push(number);
    } else if (number >= 61 && number <= 75 && O.length <= 4) {
      O.push(number);
    } else {
      continue;
    }

    const index = newBase.indexOf(number);
    if (index !== -1) newBase.splice(index, 1);
    newBase = shuffleArray(newBase);
  }

  let numbers: Uint8Array = new Uint8Array();
  B.forEach((n) => {
    numbers = Uint8Array.from([...numbers, n]);
  });
  I.forEach((n) => {
    numbers = Uint8Array.from([...numbers, n]);
  });
  N.forEach((n) => {
    numbers = Uint8Array.from([...numbers, n]);
  });
  G.forEach((n) => {
    numbers = Uint8Array.from([...numbers, n]);
  });
  O.forEach((n) => {
    numbers = Uint8Array.from([...numbers, n]);
  });

  return numbers;
};
