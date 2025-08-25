import { sortNumber, sortString } from "~/components/utils/reducerUtils";

/**
 * Collection-specific reducer utilities for lists of collections (Authors page).
 *
 * Handles collection-specific filtering logic including:
 * - Name filtering
 *
 * Note: Collections do not use pagination (Show More functionality)
 *
 * These utilities build on top of the base reducerUtils
 */
import type { ListWithFiltersState } from "./reducerUtils";

import { updatePendingFilter } from "./reducerUtils";

/**
 * Collection-specific action types
 */
export enum CollectionsFilterActions {
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
}

/**
 * Union type of all collection-specific filter actions
 */
export type CollectionsFilterActionType = PendingFilterNameAction;

/**
 * Collection-specific action type definitions
 */
type PendingFilterNameAction = {
  type: CollectionsFilterActions.PENDING_FILTER_NAME;
  value: string;
};

/**
 * Handle Name filter action
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
  const baseState = updatePendingFilter(state, "name", filterFn, action.value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Collection-specific sort helpers
 */
export function sortName<T extends { sortName: string }>() {
  return {
    "name-asc": (a: T, b: T) => sortString(a.sortName, b.sortName),
    "name-desc": (a: T, b: T) => sortString(a.sortName, b.sortName) * -1,
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

/**
 * Create a Name filter function
 */
function createNameFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { name: string }>(item: T) => regex.test(item.name);
}
