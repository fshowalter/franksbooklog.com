export type GroupFn<TValue, TSort extends string> = (
  value: TValue,
  sort: TSort,
) => string;

/**
 * Extracts the grouping letter from a string for alphabetical grouping.
 * Non-alphabetic characters are grouped under "#".
 * @param str - The string to extract the grouping letter from
 * @returns Uppercase letter or "#" for non-alphabetic characters
 */
export function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

/**
 * Groups an array of values into a Map based on a grouping function.
 * @param values - Array of values to group
 * @param sort - Sort criteria passed to the grouper function
 * @param grouper - Function that determines the group key for each value
 * @returns Map with group keys and their corresponding values
 */
export function groupValues<TValue, TSort extends string>(
  values: TValue[],
  sort: TSort,
  grouper: GroupFn<TValue, TSort>,
) {
  const grouped = new Map<string, TValue[]>();

  for (const value of values) {
    const key = grouper(value, sort);
    const group = grouped.get(key) || [];
    group.push(value);
    grouped.set(key, group);
  }

  return grouped;
}
