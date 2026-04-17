import { GradeFacet } from "~/components/filter-and-sort/facets/grade/GradeFacet";
import { KindFacet } from "~/components/filter-and-sort/facets/kind/KindFacet";
import { ReviewYearFacet } from "~/components/filter-and-sort/facets/review-year/ReviewYearFacet";
import { ReviewedStatusFacet } from "~/components/filter-and-sort/facets/reviewed-status/ReviewedStatusFacet";
import { TitleYearFacet } from "~/components/filter-and-sort/facets/title-year/TitleYearFacet";
import { TitleFacet } from "~/components/filter-and-sort/facets/title/TitleFacet";

import type { ReviewsValue } from "./Reviews";
import type { ReviewsAction, ReviewsFiltersValues } from "./reviewsReducer";

import { filterReviews } from "./filterReviews";

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
  values,
}: {
  dispatch: React.Dispatch<ReviewsAction>;
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctTitleYears: readonly string[];
  filterValues: ReviewsFiltersValues;
  values: readonly ReviewsValue[];
}): React.JSX.Element {
  return (
    <>
      <TitleFacet defaultValue={filterValues.title} dispatch={dispatch} />
      <TitleYearFacet
        dispatch={dispatch}
        distinctYears={distinctTitleYears}
        values={filterValues.titleYear}
      />
      <KindFacet
        dispatch={dispatch}
        distinctKinds={distinctKinds}
        filterer={filterReviews}
        filterValues={filterValues}
        values={values}
      />
      <ReviewedStatusFacet
        dispatch={dispatch}
        excludeNotReviewed={true}
        filterer={filterReviews}
        filterValues={filterValues}
        values={values}
      />
      <GradeFacet dispatch={dispatch} gradeValues={filterValues.gradeValue} />
      <ReviewYearFacet
        dispatch={dispatch}
        distinctYears={distinctReviewYears}
        values={filterValues.reviewYear}
      />
    </>
  );
}
