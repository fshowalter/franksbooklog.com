export type FilterableValue = { title: string };
type Filters = { title?: string };

export function createTitleFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.title;
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean => regex.test(value.title);
}
