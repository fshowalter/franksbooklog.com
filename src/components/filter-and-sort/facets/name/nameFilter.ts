type Filters = { name?: string };
type Value = { name: string; sortName: string };

export function createNameFilter<
  TValue extends Value,
  TFilters extends Filters,
>(filters: TFilters) {
  const filterValue = filters.name;
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean =>
    regex.test(value.name) || regex.test(value.sortName);
}
