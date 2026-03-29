type Filters = { reviewYear?: [string, string] };
type Value = { reviewYear: string };

export function createReviewYearFilter<
  TValue extends Value,
  TFilters extends Filters,
>(filters: TFilters) {
  const filterValue = filters.reviewYear;
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
    );
  };
}
