type Filters = { edition?: readonly string[] };
type Value = { edition: string };

export function createEditionCountMap<
  TValue extends Value,
  TFilters extends Filters,
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, edition: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    counts.set(value.edition, (counts.get(value.edition) ?? 0) + 1);
  }

  return counts;
}

export function createEditionFilter<TValue extends Value>(filters: Filters) {
  const filterValue = filters.edition;
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => filterValue.includes(value.edition);
}
