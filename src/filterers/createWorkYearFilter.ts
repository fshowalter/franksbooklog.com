/**
 * Create a Work Year filter function
 */
export function createWorkYearFilter<TValue extends { workYear: string }>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return value.workYear >= filterValue[0] && value.workYear <= filterValue[1];
  };
}
