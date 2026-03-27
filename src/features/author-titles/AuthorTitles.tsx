import { useReducer } from "react";

import type { CoverImageProps } from "~/assets/covers";
import type { GradeType, GradeValueType } from "~/utils/grades";

import { FilterAndSortContainer } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";
import { createKindCountMap } from "~/components/react/filter-and-sort/facets/kind/kindFilter";
import { createReviewedStatusCountMap } from "~/components/react/filter-and-sort/facets/reviewed-status/reviewedStatusFilter";
import { PaginatedList } from "~/components/react/filter-and-sort/paginated-list/PaginatedList";
import { ReviewCard } from "~/components/review-card/ReviewCard";
import { usePaginatedValues } from "~/hooks/usePaginatedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { AuthorTitlesSort } from "./sortAuthorTitles";

import { createInitialState, reducer } from "./AuthorTitles.reducer";
import { AuthorTitlesFilters } from "./AuthorTitlesFilters";
import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterAuthorTitles } from "./filterAuthorTitles";
import { sortAuthorTitles, sortOptions } from "./sortAuthorTitles";

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
  distinctTitleYears: readonly string[];
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
  excerptHtml: string;
  /** Letter grade given to the work */
  grade: GradeType;
  /** Numeric grade value for sorting */
  gradeValue: GradeValueType;
  /** Type/category of the work (e.g., "Novel", "Collection") */
  kind: string;
  /** Other authors who collaborated on this work */
  otherAuthors: {
    name: string;
    notes: string | undefined;
  }[];
  /** Date the review was written */
  reviewDate: Date;
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
  titleYear: string;
};

/**
 * Author page component displaying a filterable and sortable list of an author's works.
 * Features cover grid display, filtering by kind/year, sorting options, and pagination.
 * Uses reducer pattern for complex state management of filters and display options.
 *
 * @param props - Component props
 * @param props.distinctKinds - Available work kinds for filtering
 * @param props.distinctReviewYears - Available review years for filtering
 * @param props.distinctTitleYears - Available work years for filtering
 * @param props.initialSort - Initial sort order for the list
 * @param props.values - Array of author's work data to display
 * @returns Author page component with filtering and sorting
 */
export function AuthorTitles({
  distinctKinds,
  distinctReviewYears,
  distinctTitleYears,
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

  const [paginatedValues, totalCount] = usePaginatedValues(
    sortAuthorTitles,
    filterAuthorTitles,
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

  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      dispatch={dispatch}
      filters={
        <AuthorTitlesFilters
          dispatch={dispatch}
          distinctKinds={distinctKinds}
          distinctReviewYears={distinctReviewYears}
          distinctTitleYears={distinctTitleYears}
          filterValues={state.pendingFilterValues}
          kindCounts={kindCounts}
          reviewedStatusCounts={reviewedStatusCounts}
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
      <div
        className={`
          mx-auto w-full bg-subtle
          tablet:px-3 tablet:pt-6
        `}
        data-page-find-ignore
      >
        <PaginatedList
          dispatch={dispatch}
          totalCount={totalCount}
          visibleCount={state.showCount}
        >
          <div
            className={`
              @container/card-list mx-auto
              tablet:px-4
            `}
          >
            <ol
              className={`
                grid flex-wrap gap-8
                tablet-landscape:grid-cols-2
              `}
              data-testid="card-list"
            >
              {paginatedValues.map((value) => {
                return (
                  <ReviewCard
                    key={value.slug}
                    value={{
                      coverImageProps: value.coverImageProps,
                      date: value.reviewDate,
                      excerptHtml: value.excerptHtml,
                      grade: value.grade,
                      kind: value.kind,
                      otherAuthors: value.otherAuthors,
                      slug: value.slug,
                      title: value.title,
                      titleYear: value.titleYear,
                    }}
                  />
                );
              })}
            </ol>
          </div>
        </PaginatedList>
      </div>
    </FilterAndSortContainer>
  );
}
