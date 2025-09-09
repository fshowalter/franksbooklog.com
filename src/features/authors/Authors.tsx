import { useReducer, useState } from "react";

import type { AvatarImageProps } from "~/api/avatars";

import { GroupedAvatarList } from "~/components/avatar-list/AvatarList";
import { CollectionSortOptions } from "~/components/filter-and-sort/CollectionSortOptions";
import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";

import { AlphabetNav } from "./AlphabetNav";
import {
  authorsReducer,
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSortAction,
  initState,
} from "./Authors.reducer";
import {
  type AuthorsSort,
  selectGroupedValues,
  selectSortedFilteredValues,
} from "./Authors.sorter";
import { AuthorsListItem } from "./AuthorsListItem";
import { Filters } from "./Filters";

export type AuthorsProps = {
  initialSort: AuthorsSort;
  values: AuthorsValue[];
};

export type AuthorsValue = {
  avatarImageProps: AvatarImageProps | undefined;
  name: string;
  reviewCount: number;
  slug: string;
  sortName: string;
};

export function Authors({
  initialSort,
  values,
}: AuthorsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    authorsReducer,
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

  const groupedValues = selectGroupedValues(sortedValues, state.sort);

  return (
    <FilterAndSortContainer
      className={state.sort.startsWith("name-") ? `[--scroll-offset:52px]` : ""}
      filters={
        <Filters
          dispatch={dispatch}
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
          dispatch(createSortAction(e.target.value as AuthorsSort)),
        sortOptions: <CollectionSortOptions />,
      }}
      topNav={
        <AlphabetNav groupedValues={groupedValues} sortValue={state.sort} />
      }
      totalCount={state.filteredValues.length}
    >
      <GroupedAvatarList
        groupedValues={groupedValues}
        groupItemClassName={`scroll-mt-[calc(52px_+_var(--filter-and-sort-container-scroll-offset))]`}
      >
        {(value) => <AuthorsListItem key={value.slug} value={value} />}
      </GroupedAvatarList>
    </FilterAndSortContainer>
  );
}
