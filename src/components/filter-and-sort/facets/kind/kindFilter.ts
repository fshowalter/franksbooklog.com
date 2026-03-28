/**
 * Counts items by kind.
 * @param values - Array of items to count
 * @returns Map from kind string to item count
 */
export function createKindCountMap<TValue extends { kind: string }>(
  values: readonly TValue[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
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
