/**
 * Reducer utilities for collection-based lists (groups of items).
 * Used by Collections and CastAndCrew components.
 */

import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

import { updatePendingFilter } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  getGroupLetter,
  sortNumber,
  sortString,
} from "~/components/utils/reducerUtils";

/**
 * Collection-specific filter actions
 */
export enum CollectionsActions {
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
}

/**
 * Type for collection filter values with known keys
 */
export type CollectionFilterValues = {
  name?: string;
};

// Union type for all collection-specific actions
export type CollectionsActionType<TSortValue = unknown> =
  | ListWithFiltersActionType<TSortValue>
  | PendingFilterNameAction;

// ============================================================================
// Collection-specific Action Types
// ============================================================================

/**
 * Specialized state type for collection-based lists with typed filter values
 */
export type CollectionsListState<TItem, TSortValue> = Omit<
  ListWithFiltersState<TItem, TSortValue>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: CollectionFilterValues;
  pendingFilterValues: CollectionFilterValues;
};

export type CollectionsSortType =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

/**
 * Base type for items that can be grouped by common title sorts
 */
type GroupableCollectionItem = {
  name: string;
  reviewCount: number;
};

type PendingFilterNameAction = {
  type: CollectionsActions.PENDING_FILTER_NAME;
  value: string;
};

/**
 * Creates a generic groupForValue function for title-based lists
 */
export function createCollectionGroupForValue<
  T extends GroupableCollectionItem,
  TSortValue extends CollectionsSortType,
>(): (value: T, sortValue: TSortValue) => string {
  return (value: T, sortValue: TSortValue): string => {
    switch (sortValue) {
      case "name-asc":
      case "name-desc": {
        return getGroupLetter(value.name);
      }
      case "review-count-asc":
      case "review-count-desc": {
        return "";
      }
    }
  };
}

// ============================================================================
// Collection-specific Filter Handlers
// ============================================================================

/**
 * Handle Name filter action for collections
 */
export function handleNameFilterAction<
  TItem extends { name: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterNameAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createNameFilter(action.value);
  const filterKey: keyof CollectionFilterValues = "name";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.value,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

// ============================================================================
// Collection-specific Sort Functions
// ============================================================================

export function sortName<T extends { name: string }>() {
  return {
    "name-asc": (a: T, b: T) => sortString(a.name, b.name),
    "name-desc": (a: T, b: T) => sortString(a.name, b.name) * -1,
  };
}

export function sortReviewCount<T extends { reviewCount: number }>() {
  return {
    "review-count-asc": (a: T, b: T) =>
      sortNumber(a.reviewCount, b.reviewCount),
    "review-count-desc": (a: T, b: T) =>
      sortNumber(a.reviewCount, b.reviewCount) * -1,
  };
}

// ============================================================================
// Private Filter Creation Functions
// ============================================================================

function createNameFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { name: string }>(item: T) => regex.test(item.name);
}
