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
