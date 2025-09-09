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

/**
 * Props interface for the Authors page component.
 * Contains all data needed to render the authors list with filtering and sorting.
 */
export type AuthorsProps = {
  /** Initial sort order to apply when page loads */
  initialSort: AuthorsSort;
  /** Array of author data for display and filtering */
  values: AuthorsValue[];
};

/**
 * Data structure representing a single author in the authors list.
 * Contains all information needed to display the author and apply filters/sorting.
 */
export type AuthorsValue = {
  /** Avatar image props for displaying the author's photo */
  avatarImageProps: AvatarImageProps | undefined;
  /** Author's display name */
  name: string;
  /** Number of reviews by this author */
  reviewCount: number;
  /** URL slug for the author's page */
  slug: string;
  /** Normalized name used for sorting */
  sortName: string;
};

/**
 * Authors page component displaying a filterable and sortable list of all authors.
 * Features avatar grid display, name filtering, sorting options, and alphabet navigation.
 * Uses reducer pattern for complex state management of filters and display options.
 *
 * @param props - Component props
 * @param props.initialSort - Initial sort order for the authors list
 * @param props.values - Array of author data to display
 * @returns Authors page component with filtering and sorting
 */
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
