/**
 * Converts an array of items to a sentence-like format with "and" before the last item.
 * Filters out falsy values and handles proper comma separation.
 *
 * @param values - Array of React elements or strings to join
 * @returns Array formatted for sentence display (e.g., ["A", ", ", "B", " and ", "C"])
 */
export function toSentenceArray<T extends React.JSX.Element | string>(
  values: readonly T[],
): T[] {
  const items = values.filter(Boolean);

  if (items.length < 2) {
    return items;
  }

  const lastItem = items.pop()!;
  const lastItems = [" and ", lastItem];
  return [...items, ...lastItems] as T[];
}
