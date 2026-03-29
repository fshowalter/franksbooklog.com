type Filters = { readingYear?: [string, string] };
type Value = { readingYear: string };

export function createReadingYearFilter<
  TValue extends Value,
  TFilters extends Filters,
>(filters: TFilters) {
  const filterValue = filters.readingYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.readingYear >= filterValue[0] && value.readingYear <= filterValue[1]
    );
  };
}
