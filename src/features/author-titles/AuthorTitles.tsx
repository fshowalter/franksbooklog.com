import { useReducer } from "react";

import type { CoverImageProps } from "~/api/covers";

import { GroupedCoverList } from "~/components/cover-list/GroupedCoverList";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { REVIEWED_WORK_SORT_OPTIONS } from "~/components/filter-and-sort/ReviewedWorkSortOptions";
import { createReviewedStatusCountMap } from "~/filterers/createReviewedStatusFilter";
import { createKindCountMap } from "~/filterers/filterTitles";
import { usePaginatedGroupedValues } from "~/hooks/usePaginatedGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { AuthorTitlesSort } from "./sortAuthorTitles";

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
} from "./AuthorTitles.reducer";
import { AuthorTitlesFilters } from "./AuthorTitlesFilters";
import { AuthorWorksListItem } from "./AuthorTitlesListItem";
import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterAuthorTitles } from "./filterAuthorTitles";
import { groupAuthorTitles } from "./groupAuthorTitles";
import { sortAuthorTitles } from "./sortAuthorTitles";

/**
 * Props interface for the Author page component.
 * Contains all data needed to render the author page with filtering and sorting.
 */
export type AuthorTitlesProps = {
  /** Available work kinds for filter dropdown options */
  distinctKinds: readonly string[];
  /** Available review years for filter dropdown options */
  distinctReviewYears: readonly string[];
  /** Available work years for filter dropdown options */
  distinctWorkYears: readonly string[];
  /** Initial sort order to apply when page loads */
  initialSort: AuthorTitlesSort;
  /** Array of author's work data for display and filtering */
  values: AuthorTitlesValue[];
};

/**
 * Data structure representing a single work by the author.
 * Contains all information needed to display the work in lists and apply filters/sorting.
 */
export type AuthorTitlesValue = {
  /** Whether the work was abandoned (grade === "Abandoned") */
  abandoned: boolean;
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
  /** Other authors who collaborated on this work */
  otherAuthors: {
    name: string;
  }[];
  /** Date the review was written */
  reviewDate: Date;
  /** Always true — every item in the author-titles list has been reviewed */
  reviewed: boolean;
  /** Sequence number for review ordering */
  reviewSequence: string;
  /** Year the review was written */
  reviewYear: string;
  /** URL slug for the work's review page */
  slug: string;
  /** Title used for sorting (normalized) */
  sortTitle: string;
  /** Display title of the work */
  title: string;
  /** Year the work was originally published */
  workYear: string;
};

/**
 * Author page component displaying a filterable and sortable list of an author's works.
 * Features cover grid display, filtering by kind/year, sorting options, and pagination.
 * Uses reducer pattern for complex state management of filters and display options.
 *
 * @param props - Component props
 * @param props.distinctKinds - Available work kinds for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.distinctWorkYears - Available work years for filtering
 * @param props.initialSort - Initial sort order for the list
 * @param props.values - Array of author's work data to display
 * @returns Author page component with filtering and sorting
 */
export function AuthorTitles({
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  initialSort,
  values,
}: AuthorTitlesProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [groupedValues, totalCount] = usePaginatedGroupedValues(
    sortAuthorTitles,
    filterAuthorTitles,
    groupAuthorTitles,
    state.values,
    state.sort,
    state.activeFilterValues,
    state.showCount,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterAuthorTitles,
    state.values,
    state.pendingFilterValues,
  );

  const reviewedStatusCounts = createReviewedStatusCountMap(state.values);
  const kindCounts = createKindCountMap(state.values);

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
        <AuthorTitlesFilters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctReviewYears={distinctReviewYears}
          distinctWorkYears={distinctWorkYears}
          filterValues={state.pendingFilterValues}
          kindCounts={kindCounts}
          reviewedStatusCounts={reviewedStatusCounts}
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
        sortOptions: REVIEWED_WORK_SORT_OPTIONS,
      }}
      totalCount={totalCount}
    >
      <GroupedCoverList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={totalCount}
        visibleCount={state.showCount}
      >
        {(value) => <AuthorWorksListItem key={value.slug} value={value} />}
      </GroupedCoverList>
    </FilterAndSortContainer>
  );
}
