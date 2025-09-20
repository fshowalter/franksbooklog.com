import { ReviewedWorkFilters } from "~/components/filter-and-sort/ReviewedWorkFilters";

import type {
  AuthorTitlesAction,
  AuthorTitlesFiltersValues,
} from "./AuthorTitles.reducer";

import {
  createGradeFilterChangedAction,
  createKindFilterChangedAction,
  createReviewYearFilterChangedAction,
  createTitleFilterChangedAction,
  createWorkYearFilterChangedAction,
} from "./AuthorTitles.reducer";

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
export function AuthorTitlesFilters({
  dispatch,
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  filterValues,
}: {
  dispatch: React.Dispatch<AuthorTitlesAction>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  filterValues: AuthorTitlesFiltersValues;
}): React.JSX.Element {
  return (
    <ReviewedWorkFilters
      grade={{
        defaultValues: filterValues.gradeValue,
        onChange: (values) => dispatch(createGradeFilterChangedAction(values)),
      }}
      kind={{
        defaultValue: filterValues.kind,
        onChange: (value) => dispatch(createKindFilterChangedAction(value)),
        values: distinctKinds,
      }}
      reviewYear={{
        defaultValues: filterValues.reviewYear,
        onChange: (values) =>
          dispatch(createReviewYearFilterChangedAction(values)),
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
