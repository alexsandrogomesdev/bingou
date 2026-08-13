export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];

  for (let c = newArray.length - 1; c > 0; c--) {
    const r = Math.floor(Math.random() * (c + 1));

    const temp = newArray[c]!;
    newArray[c] = newArray[r]!;
    newArray[r] = temp;
  }

  return newArray;
};
export const getRandomNumber = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
};

export const isObjectEmpty = (val: unknown) =>
  val !== null &&
  typeof val === "object" &&
  !Array.isArray(val) &&
  Object.keys(val).length === 0;
