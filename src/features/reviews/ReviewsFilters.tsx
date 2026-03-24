import { ReviewedWorkFilters } from "~/components/react/reviewed-work-filters/ReviewedWorkFilters";
import { GRADE_MAX, GRADE_MIN } from "~/utils/grades";

import type { ReviewsAction, ReviewsFiltersValues } from "./Reviews.reducer";

import {
  createGradeFilterChangedAction,
  createKindFilterChangedAction,
  createRemoveAppliedFilterAction,
  createReviewedStatusFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  createTitleYearFilterChangedAction,
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
 * @param props.distinctTitleYears - Available work years for filtering
 * @param props.filterValues - Current filter values
 * @returns Filter controls component
 */
export function ReviewsFilters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctTitleYears,
  filterValues,
  kindCounts,
  reviewedStatusCounts,
}: {
  dispatch: React.Dispatch<ReviewsAction>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctTitleYears: readonly string[];
  filterValues: ReviewsFiltersValues;
  kindCounts?: Map<string, number>;
  reviewedStatusCounts?: Map<string, number>;
}): React.JSX.Element {
  return (
    <ReviewedWorkFilters
      grade={{
        defaultValues: filterValues.gradeValue,
        onChange: (values) => dispatch(createGradeFilterChangedAction(values)),
        onClear: () =>
          dispatch(createGradeFilterChangedAction([GRADE_MIN, GRADE_MAX])),
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
          dispatch(
            createReviewYearFilterChangedAction(
              values,
              distinctReviewYears[0] ?? "",
              distinctReviewYears.at(-1) ?? "",
            ),
          ),
        onClear: () => dispatch(createRemoveAppliedFilterAction("reviewYear")),
        values: distinctReviewYears,
      }}
      title={{
        defaultValue: filterValues.title,
        onChange: (value) => dispatch(createTitleFilterChangedAction(value)),
      }}
      workYear={{
        defaultValues: filterValues.workYear,
        onChange: (values) =>
          dispatch(
            createTitleYearFilterChangedAction(
              values,
              distinctTitleYears[0] ?? "",
              distinctTitleYears.at(-1) ?? "",
            ),
          ),
        values: distinctTitleYears,
      }}
    />
  );
}
