import { useReducer } from "react";

import type { CoverImageProps } from "~/api/covers";

import { GroupedCoverList } from "~/components/cover-list/GroupedCoverList";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { REVIEWED_WORK_SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedWorkSortOptions";
import { usePaginatedGroupedValues } from "~/hooks/usePaginatedGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterReviews } from "./filterReviews";
import { groupReviews } from "./groupReviews";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createShowMoreAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./Reviews.reducer";
import { ReviewsFilters } from "./ReviewsFilters";
import { ReviewsListItem } from "./ReviewsListItem";
import { sortReviews } from "./sortReviews";

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
  distinctWorkYears: readonly string[];
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
    sortName: string;
  }[];
  /** Cover image props for displaying the work's cover */
  coverImageProps: CoverImageProps;
  /** Formatted display date for the review */
  displayDate: string;
  /** Letter grade given to the work */
  grade: string;
  /** Numeric grade value for sorting */
  gradeValue: number;
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
  workYear: string;
};

/**
 * Reviews page component displaying a filterable and sortable list of book reviews.
 * Features cover grid display, filtering by kind/year, sorting options, and pagination.
 * Uses reducer pattern for complex state management of filters and display options.
 *
 * @param props - Component props
 * @param props.distinctKinds - Available work kinds for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.distinctWorkYears - Available work years for filtering
 * @param props.initialSort - Initial sort order for the list
 * @param props.values - Array of review data to display
 * @returns Reviews page component with filtering and sorting
 */
export function Reviews({
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
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
  const [groupedValues, totalCount] = usePaginatedGroupedValues(
    sortReviews,
    filterReviews,
    groupReviews,
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

  const hasPendingFilters = selectHasPendingFilters(state);
  const activeFilters = buildAppliedFilterChips(
    state.activeFilterValues,
    distinctWorkYears,
    distinctReviewYears,
  );

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      filters={
        <ReviewsFilters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctReviewYears={distinctReviewYears}
          distinctWorkYears={distinctWorkYears}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
        dispatch(createApplyFiltersAction());
      }}
      onFilterDrawerOpen={() => dispatch(createResetFiltersAction())}
      onRemoveFilter={(id) => dispatch(createRemoveAppliedFilterAction(id))}
      onResetFilters={() => {
        dispatch(createResetFiltersAction());
      }}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (value) => dispatch(createSortAction(value)),
        sortOptions: [
          { label: "Author (A \u2192 Z)", value: "author-asc" },
          { label: "Author (Z \u2192 A)", value: "author-desc" },
          ...REVIEWED_WORK_SORT_OPTIONS,
        ],
      }}
      totalCount={totalCount}
    >
      <GroupedCoverList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        {(value) => <ReviewsListItem key={value.slug} value={value} />}
      </GroupedCoverList>
    </FilterAndSortContainer>
  );
}
