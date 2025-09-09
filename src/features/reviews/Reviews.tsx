import { useReducer, useState } from "react";

import type { CoverImageProps } from "~/api/covers";

import { GroupedCoverList } from "~/components/cover-list/GroupedCoverList";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedWorkSortOptions } from "~/components/filter-and-sort/ReviewedWorkSortOptions";

import type { ReviewsSort } from "./Reviews.sorter";

import { Filters } from "./Filters";
import {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createShowMoreAction,
  createSortAction,
  initState,
  reviewsReducer,
} from "./Reviews.reducer";
import {
  selectGroupedValues,
  selectSortedFilteredValues,
} from "./Reviews.sorter";
import { ReviewsListItem } from "./ReviewsListItem";

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
  /** Authors of the reviewed work */
  authors: {
    name: string;
    sortName: string;
  }[];
  /** Sequence number for author-based sorting */
  authorSequence: number;
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
  /** Sequence number for chronological review ordering */
  reviewSequence: number;
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
  /** Sequence number for work year ordering */
  workYearSequence: number;
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
    reviewsReducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);

  const sortedValues = selectSortedFilteredValues(
    state.filteredValues,
    state.sort,
  );

  const groupedValues = selectGroupedValues(
    sortedValues,
    state.showCount,
    state.sort,
  );

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctReviewYears={distinctReviewYears}
          distinctWorkYears={distinctWorkYears}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      onApplyFilters={() => dispatch(createApplyPendingFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearPendingFiltersAction());
        setFilterKey((k) => k + 1);
      }}
      onFilterDrawerOpen={() => dispatch(createResetPendingFiltersAction())}
      onResetFilters={() => {
        dispatch(createResetPendingFiltersAction());
        setFilterKey((k) => k + 1);
      }}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch(createSortAction(e.target.value as ReviewsSort)),
        sortOptions: (
          <>
            <option value="author-asc">Author (A &rarr; Z)</option>
            <option value="author-desc">Author (Z &rarr; A)</option>
            <ReviewedWorkSortOptions />
          </>
        ),
      }}
      totalCount={state.filteredValues.length}
    >
      <GroupedCoverList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={state.filteredValues.length}
        visibleCount={state.showCount}
      >
        {(value) => <ReviewsListItem key={value.slug} value={value} />}
      </GroupedCoverList>
    </FilterAndSortContainer>
  );
}
