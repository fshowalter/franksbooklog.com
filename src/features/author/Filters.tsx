import { ReviewedWorkFilters } from "~/components/filter-and-sort/ReviewedWorkFilters";

import type { AuthorActionType, AuthorFiltersValues } from "./Author.reducer";

import {
  createSetGradePendingFilterAction,
  createSetKindPendingFilterAction,
  createSetReviewYearPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
} from "./Author.reducer";

/**
 * Author page filters component providing filtering controls for the author's works.
 * Includes filters for grade, work kind, review year, title search, and work year.
 * Uses the shared ReviewedWorkFilters component with author-specific action dispatchers.
 * 
 * @param props - Component props
 * @param props.dispatch - Reducer dispatch function for filter actions
 * @param props.distinctKinds - Available work kinds for filtering dropdown
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.distinctWorkYears - Available work years for filtering
 * @param props.filterValues - Current filter values from component state
 * @returns Filter controls for the author page
 */
export function Filters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<AuthorActionType>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: AuthorFiltersValues;
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
