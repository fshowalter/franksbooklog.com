import { ReviewedWorkFilters } from "~/components/filter-and-sort/ReviewedWorkFilters";

import type { ReviewsAction, ReviewsFiltersValues } from "./Reviews.reducer";

import {
  createGradeFilterChangedAction,
  createKindFilterChangedAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
} from "./Reviews.reducer";

/**
 * Filter controls component for the Reviews page.
 * Provides filtering interface for grade, kind, review year, title, and work year.
 * Manages filter state through Redux-style reducer actions.
 *
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctKinds - Available book kinds for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.distinctWorkYears - Available work years for filtering
 * @param props.filterValues - Current filter values
 * @returns Filter controls component
 */
export function ReviewsFilters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  filterValues,
  kindCounts,
  reviewedStatusCounts,
}: {
  dispatch: React.Dispatch<ReviewsAction>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: ReviewsFiltersValues;
  kindCounts?: Map<string, number>;
  reviewedStatusCounts?: Map<string, number>;
}): React.JSX.Element {
  return (
    <ReviewedWorkFilters
      grade={{
        defaultValues: filterValues.gradeValue,
        onChange: (values) => dispatch(createGradeFilterChangedAction(values)),
        onClear: () => dispatch(createGradeFilterChangedAction([2, 16])),
      }}
      kind={{
        counts: kindCounts,
        defaultValues: filterValues.kind,
        onChange: (values) => dispatch(createKindFilterChangedAction(values)),
        onClear: () => dispatch(createKindFilterChangedAction([])),
        values: distinctKinds,
      }}
      reviewedStatus={{
        counts: reviewedStatusCounts,
        defaultValues: filterValues.reviewedStatus,
        onChange: (values) =>
          dispatch(createReviewedStatusFilterChangedAction(values)),
        onClear: () => dispatch(createReviewedStatusFilterChangedAction([])),
      }}
      reviewYear={{
        defaultValues: filterValues.reviewYear,
        onChange: (values) =>
          dispatch(createReviewYearFilterChangedAction(values)),
        onClear: () =>
          dispatch(
            createReviewYearFilterChangedAction([
              distinctReviewYears[0] ?? "",
              distinctReviewYears.at(-1) ?? "",
            ]),
          ),
        values: distinctReviewYears,
      }}
      title={{
        defaultValue: filterValues.title,
        onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
      }}
      workYear={{
        defaultValues: filterValues.workYear,
        onChange: (values) =>
          dispatch(createWorkYearFilterChangedAction(values)),
        values: distinctWorkYears,
      }}
    />
  );
}
