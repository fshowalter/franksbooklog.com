import { useReducer } from "react";

import type { AvatarImageProps } from "~/assets/avatars";

import { GroupedAvatarList } from "~/components/react/avatar-list/AvatarList";
import { FilterAndSortContainer } from "~/components/react/filter-and-sort/container/FilterAndSortContainer";
import { useGroupedValues } from "~/hooks/useGroupedValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { AuthorsSort } from "./sortAuthors";

import { AlphabetSideNav } from "./AlphabetSideNav";
import {
  createInitialState,
  reducer,
  selectHasPendingFilters,
} from "./Authors.reducer";
import { AuthorsFilters } from "./AuthorsFilters";
import { AuthorsListItem } from "./AuthorsListItem";
import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { filterAuthors } from "./filterAuthors";
import { groupAuthors } from "./groupAuthors";
import { sortAuthors } from "./sortAuthors";

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
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );

  const [groupedValues, totalCount] = useGroupedValues(
    sortAuthors,
    filterAuthors,
    groupAuthors,
    state.values,
    state.sort,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterAuthors,
    state.values,
    state.pendingFilterValues,
  );

  const hasPendingFilters = selectHasPendingFilters(state);
  const activeFilters = buildAppliedFilterChips(state.activeFilterValues);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      dispatch={dispatch}
      filters={
        <AuthorsFilters
          dispatch={dispatch}
          filterValues={state.pendingFilterValues}
        />
      }
      hasPendingFilters={hasPendingFilters}
      pendingFilteredCount={pendingFilteredCount}
      sideNav={
        <AlphabetSideNav groupedValues={groupedValues} sortValue={state.sort} />
      }
      sortProps={{
        currentSortValue: state.sort,
        sortOptions: [
          { label: "Name (A \u2192 Z)", value: "name-asc" },
          { label: "Name (Z \u2192 A)", value: "name-desc" },
          { label: "Review Count (Most First)", value: "review-count-desc" },
          { label: "Review Count (Fewest First)", value: "review-count-asc" },
        ],
      }}
      totalCount={totalCount}
    >
      <GroupedAvatarList
        className="grow"
        groupedValues={groupedValues}
        groupItemClassName={`scroll-mt-[calc(52px_+_var(--filter-and-sort-container-scroll-offset))]`}
      >
        {(value) => <AuthorsListItem key={value.slug} value={value} />}
      </GroupedAvatarList>
    </FilterAndSortContainer>
  );
}
