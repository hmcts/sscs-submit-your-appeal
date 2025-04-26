export function getDayMonthYear(dateObj: Date) {
  const day = dateObj.getUTCDate();
  const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const year = dateObj.getUTCFullYear();
  return [day, month, year];
}
