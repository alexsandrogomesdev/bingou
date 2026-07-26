export const date_from_unix = (unix_time, format = 2) => {
  let res = new Date(unix_time * 1000);
  let day = String(res.getDate()).padStart(2, "0");
  let month = String(res.getMonth()).padStart(2, "0");
  let year = res.getFullYear();
  let hours = res.getHours();
  let minutes = res.getMinutes();
  let seconds = res.getSeconds();

  if (format === 1) {
    return `${day}/${month}/${year}`;
  } else if (format === 2) {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return res;
};
