export type FilterableValue = { titleYear: string };
type Filters = { titleYear?: [string, string] };

export function createTitleYearFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.titleYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.titleYear >= filterValue[0] && value.titleYear <= filterValue[1]
    );
  };
}
