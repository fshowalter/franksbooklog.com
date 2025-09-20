/**
 * Create a Title filter function
 */
export function createTitleFilter<TValue extends { title: string }>(
  filterValue?: string,
) {
  if (!filterValue) return;
  const regex = new RegExp(filterValue, "i");
  return (value: TValue): boolean => regex.test(value.title);
}
