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

export type ReviewsProps = {
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  initialSort: "author-asc";
  values: ReviewsValue[];
};

export type ReviewsValue = {
  authors: {
    name: string;
    sortName: string;
  }[];
  authorSequence: number;
  coverImageProps: CoverImageProps;
  displayDate: string;
  grade: string;
  gradeValue: number;
  kind: string;
  reviewSequence: number;
  reviewYear: string;
  slug: string;
  sortTitle: string;
  title: string;
  workYear: string;
  workYearSequence: number;
};

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
