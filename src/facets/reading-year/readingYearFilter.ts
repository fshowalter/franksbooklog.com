/**
 * Create a Reading Year filter function (range)
 */
export function createReadingYearFilter<TValue extends { readingYear: string }>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.readingYear >= filterValue[0] && value.readingYear <= filterValue[1]
    );
  };
}
