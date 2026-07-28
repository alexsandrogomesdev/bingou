export const dateFromUnix = (unix_time: number, format: number = 2): string => {
  const res: Date = new Date(unix_time * 1000);
  const day: string = String(res.getDate()).padStart(2, "0");
  const month: string = String(res.getMonth() + 1).padStart(2, "0");
  const year: string = String(res.getFullYear());
  const hours: string = String(res.getHours()).padStart(2, "0");
  const minutes: string = String(res.getMinutes()).padStart(2, "0");
  const seconds: string = String(res.getSeconds()).padStart(2, "0");

  if (format === 1) {
    return `${day}/${month}/${year}`;
  } else if (format === 2) {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export type PackedData = {
  flag: boolean;
  number: number;
};
export const encodeByte = (flag: boolean, number: number): number => {
  if (number < 0 || number > 75) {
    throw new Error(`The number ${number} has more than 7 bits`);
  }

  const cleanNumber = number & 0b01111111;
  if (flag) {
    return 0b10000000 | cleanNumber;
  }

  return cleanNumber;
};
export const decodeByte = (byte: number) => {
  const flag = (byte & 0b10000000) !== 0;

  const number = byte & 0b01111111;

  return { flag, number };
};
export const getRandomNumber = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
};
