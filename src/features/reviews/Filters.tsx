import { ReviewedWorkFilters } from "~/components/FilterAndSort/ReviewedWorkFilters";

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
