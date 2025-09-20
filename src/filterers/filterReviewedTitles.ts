import type { ReviewedTitleFiltersValues } from "~/reducers/reviewedTitleFiltersReducer";

import type { FilterableTitle } from "./filterTitles";

import { filterTitles } from "./filterTitles";

type FilterableReviewedTitle = FilterableTitle & {
  gradeValue: number;
  reviewYear: string;
};

/**
 * Filters an array of reviewed titles based on grade, review year, and other criteria.
 * @param filterValues - Object containing filter values including grade and review year
 * @param sortedValues - Array of reviewed titles to filter
 * @param extraFilters - Additional custom filter functions to apply
 * @returns Filtered array of reviewed titles matching all filter criteria
 */
export function filterReviewedTitles<TValue extends FilterableReviewedTitle>(
  filterValues: ReviewedTitleFiltersValues,
  sortedValues: TValue[],
  extraFilters: ((value: TValue) => boolean)[],
) {
  const filters: ((value: TValue) => boolean)[] = [
    createGradeFilter(filterValues.gradeValue),
    createReviewYearFilter(filterValues.reviewYear),
    ...extraFilters,
  ].filter((filterFn) => filterFn !== undefined);

  return filterTitles(filterValues, sortedValues, filters);
}

function createGradeFilter<TValue extends FilterableReviewedTitle>(
  filterValue?: [number, number],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.gradeValue >= filterValue[0] && value.gradeValue <= filterValue[1]
    );
  };
}

function createReviewYearFilter<TValue extends FilterableReviewedTitle>(
  filterValue?: [string, string],
) {
  if (!filterValue) return;
  return (value: TValue): boolean => {
    return (
      value.reviewYear >= filterValue[0] && value.reviewYear <= filterValue[1]
    );
  };
}
