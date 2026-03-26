/**
 * Create an Edition filter function (multi-select OR logic)
 */
export function createEditionFilter<TValue extends { edition: string }>(
  filterValue?: readonly string[],
) {
  if (!filterValue || filterValue.length === 0) return;
  return (value: TValue) => filterValue.includes(value.edition);
}
