export function getDayMonthYear(dateObj) {
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate() - 1; // predate by 1 day
  const year = dateObj.getUTCFullYear();
  return [day, month, year];
}