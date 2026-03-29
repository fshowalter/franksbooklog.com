export type FilterableValue = { reviewYear: string };
type Filters = { reviewYear?: [string, string] };

export function createReviewYearFilter<TValue extends FilterableValue>(
  filters: Filters,
) {
  const filterValue = filters.reviewYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
    );
  };
}
