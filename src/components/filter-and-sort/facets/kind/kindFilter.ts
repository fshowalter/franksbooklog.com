export function createKindCountMap<
  TValue extends { kind: string },
  TFilters extends { kind?: readonly string[] },
>(
  values: readonly TValue[],
  filters: TFilters,
  filterer: (values: readonly TValue[], filters: TFilters) => TValue[],
): Map<string, number> {
  // Apply all filters EXCEPT this one
  const otherFilters = { ...filters, kind: undefined };
  const filtered = filterer(values, otherFilters);

  const counts = new Map<string, number>();
  for (const value of filtered) {
    counts.set(value.kind, (counts.get(value.kind) ?? 0) + 1);
  }

  return counts;
}

/**
 * Create a Kind filter function (multi-select OR logic)
 */
export function createKindFilter<TValue extends { kind: string }>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => filterValue.includes(value.kind);
}
