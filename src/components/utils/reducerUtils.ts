/**
 * Generic reducer utilities not tied to specific state structures.
 * These utilities can be used by any reducer for common operations like
 * sorting, grouping, and filtering.
 */
import { collator } from "~/utils/collator";

/**
 * Type for group functions used in list components
 */
export type GroupFn<TItem, TSortValue> = (
  items: TItem[],
  sortValue: TSortValue,
) => Map<string, TItem[]>;

/**
 * Build group values helper - groups items by a key function
 */
export function buildGroupValues<TItem, TSortValue>(
  keyFn: (item: TItem, sortValue: TSortValue) => string,
): (items: TItem[], sortValue: TSortValue) => Map<string, TItem[]> {
  return function groupValues(
    items: TItem[],
    sortValue: TSortValue,
  ): Map<string, TItem[]> {
    const grouped = new Map<string, TItem[]>();

    for (const item of items) {
      const key = keyFn(item, sortValue);
      const group = grouped.get(key) || [];
      group.push(item);
      grouped.set(key, group);
    }

    return grouped;
  };
}

/**
 * Build sort values helper - creates a sort function from a sort map
 */
export function buildSortValues<V, S extends string>(
  sortMap: Record<S, (a: V, b: V) => number>,
) {
  return (values: V[], sortOrder: S): V[] => {
    const comparer = sortMap[sortOrder];
    return [...values].sort(comparer);
  };
}

/**
 * Filter values helper - filters items based on multiple filter functions
 */
export function filterValues<TItem>({
  filters,
  values,
}: {
  filters: Record<string, (arg0: TItem) => boolean>;
  values: readonly TItem[];
}): TItem[] {
  return values.filter((item) => {
    return Object.values(filters).every((filter) => {
      return filter(item);
    });
  });
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