export const collator = new Intl.Collator("en", {
  ignorePunctuation: true,
  numeric: true,
  sensitivity: "base",
});

export function sortNumber(a: number, b: number): number {
  return a - b;
}

export function sortString(a: string, b: string): number {
  if (a > b) {
    return 1;
  }

  if (a < b) {
    return -1;
  }

  return 0;
}
