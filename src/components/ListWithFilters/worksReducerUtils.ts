import { sortNumber, sortString } from "~/components/utils/reducerUtils";

/**
 * Work-specific reducer utilities for lists of works (Reviews, Readings, Author pages).
 *
 * Handles work-specific filtering logic including:
 * - Title filtering
 * - Work year filtering
 * - Review year filtering
 * - Kind filtering
 * - Pagination (Show More functionality)
 *
 * These utilities build on top of the base reducerUtils
 */
import type { ListWithFiltersState } from "./reducerUtils";

import {
  createInitialState,
  updatePendingFilter,
} from "./reducerUtils";

/**
 * Default number of items to show per page for paginated work lists
 */
const SHOW_COUNT_DEFAULT = 100;

/**
 * Work-specific action types
 */
export enum WorksFilterActions {
  PENDING_FILTER_KIND = "PENDING_FILTER_KIND",
  PENDING_FILTER_REVIEW_YEAR = "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  PENDING_FILTER_WORK_YEAR = "PENDING_FILTER_WORK_YEAR",
  SHOW_MORE = "SHOW_MORE",
}

/**
 * State type for lists with pagination (Show More) enabled
 */
export type ListWithFiltersAndShowCountState<TItem, TSortValue> =
  ListWithFiltersState<TItem, TSortValue> & PaginationState;

/**
 * Extended state for pagination support
 */
export type PaginationState = {
  showCount: number;
};

/**
 * Work-specific action type definitions
 */
export type PendingFilterKindAction = {
  type: WorksFilterActions.PENDING_FILTER_KIND;
  value: string;
};

export type PendingFilterReviewYearAction = {
  type: WorksFilterActions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

export type PendingFilterTitleAction = {
  type: WorksFilterActions.PENDING_FILTER_TITLE;
  value: string;
};

export type PendingFilterWorkYearAction = {
  type: WorksFilterActions.PENDING_FILTER_WORK_YEAR;
  values: [string, string];
};

export type ShowMoreAction = {
  increment?: number;
  type: WorksFilterActions.SHOW_MORE;
};

/**
 * Union type of all work-specific filter actions
 */
export type WorksFilterActionType =
  | PendingFilterKindAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | PendingFilterWorkYearAction
  | ShowMoreAction;

/**
 * Apply pending filters with pagination support
 */
export function applyPendingFiltersWithPagination<
  TItem,
  TSortValue,
  TState extends ListWithFiltersState<TItem, TSortValue> & PaginationState,
>(
  state: TState,
  baseResult: ListWithFiltersState<TItem, TSortValue>,
  groupFn: (items: TItem[], sortValue: TSortValue) => Map<string, TItem[]>,
): TState {
  const paginatedGroupFn = createPaginatedGroupFn(groupFn, state.showCount);
  const groupedValues = paginatedGroupFn(
    baseResult.filteredValues,
    baseResult.sortValue,
  );
  return {
    ...state,
    ...baseResult,
    groupedValues,
  };
}

/**
 * Create initial state with optional pagination support
 */
export function createInitialStateWithPagination<TItem, TSortValue>({
  groupFn,
  initialSort,
  showMoreEnabled = true,
  sortFn,
  values,
}: {
  groupFn: (items: TItem[], sortValue: TSortValue) => Map<string, TItem[]>;
  initialSort: TSortValue;
  showMoreEnabled?: boolean;
  sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  values: TItem[];
}): ListWithFiltersState<TItem, TSortValue> & Partial<PaginationState> {
  const baseState = createInitialState({
    groupFn: showMoreEnabled
      ? createPaginatedGroupFn(groupFn, SHOW_COUNT_DEFAULT)
      : groupFn,
    initialSort,
    sortFn,
    values,
  });

  if (showMoreEnabled) {
    return {
      ...baseState,
      showCount: SHOW_COUNT_DEFAULT,
    };
  }

  return baseState;
}

/**
 * Handle Kind filter action
 */
export function handleKindFilterAction<
  TItem extends { kind: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterKindAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createKindFilter(action.value);
  const baseState = updatePendingFilter(state, "kind", filterFn, action.value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle Review Year filter action
 */
export function handleReviewYearFilterAction<
  TItem extends { reviewYear?: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterReviewYearAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createReviewYearFilter(action.values[0], action.values[1]);
  const baseState = updatePendingFilter(
    state,
    "reviewYear",
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle "Show More" pagination action
 */
export function handleShowMoreAction<
  TItem,
  TSortValue,
  TState extends ListWithFiltersState<TItem, TSortValue> & PaginationState,
>(
  state: TState,
  action: ShowMoreAction,
  groupFn: (items: TItem[], sortValue: TSortValue) => Map<string, TItem[]>,
): TState {
  const increment = action.increment ?? SHOW_COUNT_DEFAULT;
  const showCount = state.showCount + increment;
  const paginatedGroupFn = createPaginatedGroupFn(groupFn, showCount);
  const groupedValues = paginatedGroupFn(
    state.filteredValues,
    state.sortValue,
  );

  return {
    ...state,
    groupedValues,
    showCount,
  };
}

/**
 * Handle Title filter action
 */
export function handleTitleFilterAction<
  TItem extends { title: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterTitleAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createTitleFilter(action.value);
  const baseState = updatePendingFilter(state, "title", filterFn, action.value);
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle Work Year filter action
 */
export function handleWorkYearFilterAction<
  TItem extends { workYear: string },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterWorkYearAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createWorkYearFilter(action.values[0], action.values[1]);
  const baseState = updatePendingFilter(
    state,
    "workYear",
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Work-specific sort helpers
 */
export function sortGrade<T extends { gradeValue?: null | number }>() {
  return {
    "grade-asc": (a: T, b: T) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0),
    "grade-desc": (a: T, b: T) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0) * -1,
  };
}

export function sortReviewDate<T extends { reviewSequence?: null | number }>() {
  return {
    "review-date-asc": (a: T, b: T) =>
      sortNumber(a.reviewSequence || 0, b.reviewSequence || 0),
    "review-date-desc": (a: T, b: T) =>
      sortNumber(a.reviewSequence || 0, b.reviewSequence || 0) * -1,
  };
}

export function sortTitle<T extends { sortTitle: string }>() {
  return {
    "title-asc": (a: T, b: T) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a: T, b: T) => sortString(a.sortTitle, b.sortTitle) * -1,
  };
}

export function sortWorkYear<T extends { workYearSequence: number }>() {
  return {
    "work-year-asc": (a: T, b: T) =>
      sortNumber(a.workYearSequence, b.workYearSequence),
    "work-year-desc": (a: T, b: T) =>
      sortNumber(a.workYearSequence, b.workYearSequence) * -1,
  };
}

/**
 * Update sort with pagination support
 */
export function updateSortWithPagination<
  TItem,
  TSortValue,
  TState extends ListWithFiltersState<TItem, TSortValue> & PaginationState,
>(
  state: TState,
  baseResult: ListWithFiltersState<TItem, TSortValue>,
  groupFn: (items: TItem[], sortValue: TSortValue) => Map<string, TItem[]>,
): TState {
  const paginatedGroupFn = createPaginatedGroupFn(groupFn, state.showCount);
  const groupedValues = paginatedGroupFn(
    baseResult.filteredValues,
    baseResult.sortValue,
  );
  return {
    ...state,
    ...baseResult,
    groupedValues,
  };
}

/**
 * Create a Kind filter function
 */
function createKindFilter(kind: string) {
  return <T extends { kind: string }>(item: T) => {
    return kind == "All" || item.kind == kind;
  };
}

/**
 * Create a paginated version of a group function
 */
function createPaginatedGroupFn<TItem, TSortValue>(
  originalGroupFn: (
    items: TItem[],
    sortValue: TSortValue,
  ) => Map<string, TItem[]>,
  limit: number,
): (items: TItem[], sortValue: TSortValue) => Map<string, TItem[]> {
  return (items: TItem[], sortValue: TSortValue) => {
    const slicedItems = items.slice(0, limit);
    return originalGroupFn(slicedItems, sortValue);
  };
}

/**
 * Create a Review Year filter function
 */
function createReviewYearFilter(minYear: string, maxYear: string) {
  return <T extends { reviewYear?: string }>(item: T) => {
    const year = item.reviewYear;
    if (!year) return false;
    return year >= minYear && year <= maxYear;
  };
}

/**
 * Create a Title filter function
 */
function createTitleFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { title: string }>(item: T) => regex.test(item.title);
}

/**
 * Create a Work Year filter function
 */
function createWorkYearFilter(minYear: string, maxYear: string) {
  return <T extends { workYear: string }>(item: T) => {
    return item.workYear >= minYear && item.workYear <= maxYear;
  };
}

