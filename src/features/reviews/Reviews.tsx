import { useReducer } from "react";

import type { CoverImageProps } from "~/assets/covers";
import type { GradeText, GradeValue } from "~/utils/grades";

import { CoverList } from "~/components/cover-list/CoverList";
import { FilterAndSortContainer } from "~/components/filter-and-sort/container/FilterAndSortContainer";
import { PaginatedList } from "~/components/filter-and-sort/paginated-list/PaginatedList";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterReviews } from "./filterReviews";
import { createInitialState, reducer } from "./Reviews.reducer";
import { ReviewsFilters } from "./ReviewsFilters";
import { ReviewsListItem } from "./ReviewsListItem";
import { sortOptions, sortReviews } from "./sortReviews";

/**
 * Props interface for the Reviews page component.
 * Contains all data needed to render the reviews list with filtering and sorting.
 */
export type ReviewsProps = {
  /** Available work kinds for filter dropdown options */
  distinctKinds: readonly string[];
  /** Available review years for filter dropdown options */
  distinctReviewYears: readonly string[];
  /** Available work years for filter dropdown options */
  distinctTitleYears: readonly string[];
  /** Fixed initial sort order (always by author name) */
  initialSort: "author-asc";
  /** Array of review data for display and filtering */
  values: ReviewsValue[];
};

/**
 * Data structure representing a single review in the reviews list.
 * Contains all information needed to display the review and apply filters/sorting.
 */
export type ReviewsValue = {
  /** Whether the work was abandoned (grade === "Abandoned") */
  abandoned: boolean;
  /** Authors of the reviewed work */
  authors: {
    name: string;
    notes: string | undefined;
    sortName: string;
  }[];
  /** Cover image props for displaying the work's cover */
  coverImageProps: CoverImageProps;
  /** Formatted display date for the review */
  displayDate: string;
  /** Letter grade given to the work */
  grade: GradeText;
  /** Numeric grade value for sorting */
  gradeValue: GradeValue;
  /** Type/category of the work (e.g., "Novel", "Collection") */
  kind: string;
  /** Sequence string for chronological review ordering */
  reviewSequence: string;
  /** Year the review was written */
  reviewYear: string;
  /** URL slug for the review page */
  slug: string;
  /** Title used for sorting (normalized) */
  sortTitle: string;
  /** Display title of the work */
  title: string;
  /** Year the work was originally published */
  titleYear: string;
};

/**
 * Reviews page component displaying a filterable and sortable list of book reviews.
 * Features cover grid display, filtering by kind/year, sorting options, and pagination.
 * Uses reducer pattern for complex state management of filters and display options.
 *
 * @param props - Component props
 * @param props.distinctKinds - Available work kinds for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.distinctTitleYears - Available work years for filtering
 * @param props.initialSort - Initial sort order for the list
 * @param props.values - Array of review data to display
 * @returns Reviews page component with filtering and sorting
 */
export function Reviews({
  distinctKinds,
  distinctReviewYears,
  distinctTitleYears,
  initialSort,
  values,
}: ReviewsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );
  const [paginatedValues, totalCount] = usePaginatedValues(
    sortReviews,
    filterReviews,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterReviews,
    state.values,
    state.pendingFilterValues,
  );

  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      dispatch={dispatch}
      filters={
        <ReviewsFilters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctReviewYears={distinctReviewYears}
          distinctTitleYears={distinctTitleYears}
          filterValues={state.pendingFilterValues}
          values={state.values}
        />
      }
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        sortOptions,
      }}
      state={state}
      totalCount={totalCount}
    >
      <PaginatedList
        dispatch={dispatch}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        <CoverList>
          {paginatedValues.map((value) => (
            <ReviewsListItem
              key={value.slug}
              sortValue={state.sort}
              value={value}
            />
          ))}
        </CoverList>
      </PaginatedList>
    </FilterAndSortContainer>
  );
}
