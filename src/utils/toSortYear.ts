export function toSortYear(date: Date) {
  return date.toISOString().slice(0, 4);
}
