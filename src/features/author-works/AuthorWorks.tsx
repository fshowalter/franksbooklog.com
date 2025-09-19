import { useReducer, useState } from "react";

import type { Author } from "~/api/authors";
import type { CoverImageProps } from "~/api/covers";

import { GroupedCoverList } from "~/components/cover-list/GroupedCoverList";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { ReviewedWorkSortOptions } from "~/components/filter-and-sort/ReviewedWorkSortOptions";

import {
  authorReducer,
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createShowMoreAction,
  createSortAction,
  initState,
} from "./AuthorWorks.reducer";
import { Filters } from "./AuthorWorksFilters";
import { AuthorWorksListItem } from "./AuthorWorksListItem";
import {
  type AuthorSort,
  selectGroupedValues,
  selectSortedFilteredValues,
} from "./sortAuthorWorks";

/**
 * Configuration for author avatar images.
 * Defines the dimensions used for avatar images in author pages and Open Graph images.
 */
export const AvatarImageConfig = {
  /** Avatar image height in pixels */
  height: 250,
  /** Avatar image width in pixels */
  width: 250,
};

/**
 * Props interface for the Author page component.
 * Contains all data needed to render the author page with filtering and sorting.
 */
export type AuthorProps = {
  /** Available work kinds for filter dropdown options */
  distinctKinds: readonly string[];
  /** Available review years for filter dropdown options */
  distinctReviewYears: readonly string[];
  /** Available work years for filter dropdown options */
  distinctWorkYears: readonly string[];
  /** Initial sort order to apply when page loads */
  initialSort: AuthorSort;
  /** Author's display name */
  name: string;
  /** Array of author's work data for display and filtering */
  values: AuthorValue[];
};

/**
 * Data structure representing a single work by the author.
 * Contains all information needed to display the work in lists and apply filters/sorting.
 */
export type AuthorValue = {
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
  /** Sequence number for review ordering */
  reviewSequence: number;
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
  /** Sequence number for work year ordering */
  workYearSequence: number;
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
export function Author({
  distinctKinds,
  distinctReviewYears,
  distinctWorkYears,
  initialSort,
  values,
}: AuthorProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    authorReducer,
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
          dispatch(createSortAction(e.target.value as AuthorSort)),
        sortOptions: <ReviewedWorkSortOptions />,
      }}
      totalCount={state.filteredValues.length}
    >
      <GroupedCoverList
        groupedValues={groupedValues}
        onShowMore={() => dispatch(createShowMoreAction())}
        totalCount={state.filteredValues.length}
        visibleCount={state.showCount}
      >
        {(value) => <AuthorWorksListItem key={value.slug} value={value} />}
      </GroupedCoverList>
    </FilterAndSortContainer>
  );
}
