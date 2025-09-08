import { collator } from "~/utils/collator";

/**
 * Build group values helper - groups items by a key function
 */
export function createGroupValues<TValue, TSort>(
  keyFn: (value: TValue, sort: TSort) => string,
): (sortedValues: TValue[], sort: TSort) => Map<string, TValue[]> {
  return function groupValues(
    sortedValues: TValue[],
    sort: TSort,
  ): Map<string, TValue[]> {
    const grouped = new Map<string, TValue[]>();

    for (const value of sortedValues) {
      const key = keyFn(value, sort);
      const group = grouped.get(key) || [];
      group.push(value);
      grouped.set(key, group);
    }

    return grouped;
  };
}

export function createSelectSortedFilteredValues<TValue, TSort>(
  sortFn: (values: TValue[], sort: TSort) => TValue[],
) {
  return function selectSortedFilteredValues(
    filteredValues: TValue[],
    sort: TSort,
  ): TValue[] {
    return sortFn(filteredValues, sort);
  };
}

/**
 * Build sort values helper - creates a sort function from a sort map
 */
export function createSortValues<V, S extends string>(
  sortMap: Record<S, (a: V, b: V) => number>,
) {
  return (values: V[], sortOrder: S): V[] => {
    const comparer = sortMap[sortOrder];
    return [...values].sort(comparer);
  };
}

/**
 * Gets the group letter for a given string, typically used for alphabetical grouping.
 * Non-alphabetic characters are grouped under "#".
 *
 * @param str - The string to get the group letter from
 * @returns The uppercase first letter or "#" for non-alphabetic characters
 */
export function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  // Check if the character is non-alphabetic (same in upper and lower case)
  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
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
