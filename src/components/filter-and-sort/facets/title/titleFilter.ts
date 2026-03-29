type Filters = { title?: string };
type Value = { title: string };

export function createTitleFilter<TValue extends Value>(filters: Filters) {
  const filterValue = filters.title;
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean => regex.test(value.title);
}
