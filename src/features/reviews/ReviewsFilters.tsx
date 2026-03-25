import { GradeFacet } from "~/components/react/filter-and-sort/facets/grade/GradeFacet";
import { KindFacet } from "~/components/react/filter-and-sort/facets/kind/KindFacet";
import { ReviewYearFacet } from "~/components/react/filter-and-sort/facets/review-year/ReviewYearFacet";
import { ReviewedStatusFacet } from "~/components/react/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleYearFacet } from "~/components/react/filter-and-sort/facets/title-year/TitleYearFacet";
import { TitleFacet } from "~/components/react/filter-and-sort/facets/title/TitleFacet";

import type { ReviewsAction, ReviewsFiltersValues } from "./Reviews.reducer";

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
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <TitleYearFacet
        defaultValues={filterValues.titleYear}
        dispatch={dispatch}
        distinctYears={distinctTitleYears}
      />
      <KindFacet
        defaultValues={filterValues.kind}
        dispatch={dispatch}
        distinctKinds={distinctKinds}
        kindCounts={kindCounts}
      />
      <ReviewedStatusFacet
        defaultValues={filterValues.reviewedStatus}
        dispatch={dispatch}
        excludeNotReviewed={true}
        statusCounts={reviewedStatusCounts}
      />
      <GradeFacet defaultValues={filterValues.gradeValue} dispatch={dispatch} />
      <ReviewYearFacet
        defaultValues={filterValues.reviewYear}
        dispatch={dispatch}
        distinctYears={distinctReviewYears}
      />
    </>
  );
}
