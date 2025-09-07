import { useReducer, useState } from "react";

import type { Author } from "~/api/authors";
import type { CoverImageProps } from "~/api/covers";

import { GroupedCoverList } from "~/components/CoverList";
import { FilterAndSortContainer } from "~/components/FilterAndSort/FilterAndSortContainer";
import { ReviewedWorkSortOptions } from "~/components/FilterAndSort/ReviewedWorkSortOptions";

import {
  authorReducer,
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createShowMoreAction,
  createSortAction,
  initState,
} from "./Author.reducer";
import {
  type AuthorSort,
  selectGroupedValues,
  selectSortedFilteredValues,
} from "./Author.sorter";
import { AuthorWorkListItem } from "./AuthorWorkListItem";
import { Filters } from "./Filters";

export const AvatarImageConfig = {
  height: 250,
  width: 250,
};

export type AuthorProps = {
  distinctKinds: readonly string[];
  distinctReviewYears: readonly string[];
  distinctWorkYears: readonly string[];
  initialSort: AuthorSort;
  name: string;
  values: AuthorValue[];
};

export type AuthorValue = {
  coverImageProps: CoverImageProps;
  displayDate: string;
  grade: string;
  gradeValue: number;
  kind: string;
  otherAuthors: {
    name: string;
  }[];
  reviewDate: Date;
  reviewSequence: number;
  reviewYear: string;
  slug: string;
  sortTitle: string;
  title: string;
  workYear: string;
  workYearSequence: number;
};

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
        {(value) => <AuthorWorkListItem key={value.slug} value={value} />}
      </GroupedCoverList>
    </FilterAndSortContainer>
  );
}
