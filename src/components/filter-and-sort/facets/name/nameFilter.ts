export type FilterableValue = { name: string; sortName: string };
type Filters = { name?: string };

export function createNameFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.name;
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean =>
    regex.test(value.name) || regex.test(value.sortName);
}
