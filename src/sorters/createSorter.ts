import { collator } from "~/utils/collator";

/**
 * Build sort values helper - creates a sort function from a sort map
 */
export function createSorter<TValue, TSort extends string>(
  sortMap: Record<string, (a: TValue, b: TValue) => number>,
) {
  return (values: TValue[], sortOrder: TSort): TValue[] => {
    const comparer = sortMap[sortOrder];
    return [...values].toSorted(comparer);
  };
}

/**
 * Common sort helper for numbers
 */
export function sortNumber(a: number, b: number): number {
  return a - b;
}

/**
 * Common sort helper for strings using locale-aware comparison
 */
export function sortString(a: string, b: string): number {
  return collator.compare(a, b);
}
