export type FilterableValue = { readingYear: string };
type Filters = { readingYear?: [string, string] };

export function createReadingYearFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.readingYear;
  return filterValue
    ? (value: TValue): boolean => {
        return (
          value.readingYear >= filterValue[0] &&
          value.readingYear <= filterValue[1]
        );
      }
    : undefined;
}
