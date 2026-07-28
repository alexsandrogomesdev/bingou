export const date_from_unix = (
  unix_time: number,
  format: number = 2,
): string => {
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
