export function createEditionCountMap<TValue extends { edition: string }>(
  values: readonly TValue[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value.edition, (counts.get(value.edition) ?? 0) + 1);
  }
  return counts;
}

export function createEditionFilter<TValue extends { edition: string }>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => filterValue.includes(value.edition);
}
