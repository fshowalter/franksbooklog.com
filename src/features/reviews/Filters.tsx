import { ReviewedWorkFilters } from "~/components/filter-and-sort/ReviewedWorkFilters";

import type {
  ReviewsActionType,
  ReviewsFiltersValues,
} from "./Reviews.reducer";

import {
  createSetGradePendingFilterAction,
  createSetKindPendingFilterAction,
  createSetReviewYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
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
export function Filters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<ReviewsActionType>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: ReviewsFiltersValues;
}): React.JSX.Element {
  return (
    <ReviewedWorkFilters
      grade={{
        initialValue: filterValues.gradeValue,
        onChange: (values) =>
          dispatch(createSetGradePendingFilterAction(values)),
      }}
      kind={{
        initialValue: filterValues.kind,
        onChange: (value) => dispatch(createSetKindPendingFilterAction(value)),
        values: distinctKinds,
      }}
      reviewYear={{
        initialValue: filterValues.reviewYear,
        onChange: (values) =>
          dispatch(createSetReviewYearPendingFilterAction(values)),
        values: distinctReviewYears,
      }}
      title={{
        initialValue: filterValues.title,
        onChange: (value) => dispatch(createSetTitlePendingFilterAction(value)),
      }}
      workYear={{
        initialValue: filterValues.workYear,
        onChange: (values) =>
          dispatch(createSetWorkYearPendingFilterAction(values)),
        values: distinctWorkYears,
      }}
    />
  );
}
