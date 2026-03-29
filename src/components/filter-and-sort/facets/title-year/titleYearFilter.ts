type Filters = { titleYear?: [string, string] };
type Value = { titleYear: string };

export function createTitleYearFilter<
  TValue extends Value,
  TFilters extends Filters,
>(filters: TFilters) {
  const filterValue = filters.titleYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.titleYear >= filterValue[0] && value.titleYear <= filterValue[1]
    );
  };
}
