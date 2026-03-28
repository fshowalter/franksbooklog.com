export function createTitleYearFilter<TValue extends { titleYear: string }>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.titleYear >= filterValue[0] && value.titleYear <= filterValue[1]
    );
  };
}
