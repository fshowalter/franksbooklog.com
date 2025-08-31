import type { GroupFn } from "~/components/utils/reducerUtils";

import {
  getGroupLetter,
  sortNumber,
  sortString,
} from "~/components/utils/reducerUtils";

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
import type { ListWithFiltersState } from "./ListWithFilters.reducerUtils";

import { updatePendingFilter } from "./ListWithFilters.reducerUtils";

/**
 * Default number of items to show per page for paginated work lists
 */
export const SHOW_COUNT_DEFAULT = 100;

/**
 * Work-specific action types
 */
export enum WorksActions {
  PENDING_FILTER_GRADE = "PENDING_FILTER_GRADE",
  PENDING_FILTER_KIND = "PENDING_FILTER_KIND",
  PENDING_FILTER_REVIEW_YEAR = "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  PENDING_FILTER_WORK_YEAR = "PENDING_FILTER_WORK_YEAR",
  SHOW_MORE = "SHOW_MORE",
}

/**
 * Type for title filter values with known keys
 */
export type WorkFilterValues = {
  grade?: [number, number];
  kind?: string;
  reviewYear?: [string, string];
  title?: string;
  workYear?: [string, string];
};

/**
 * Union type of all work-specific filter actions
 */
export type WorksActionType =
  | PendingFilterGradeAction
  | PendingFilterKindAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | PendingFilterWorkYearAction
  | ShowMoreAction;

/**
 * Specialized state type for title-based lists with typed filter values
 */
export type WorksListState<TItem, TSortValue> = Omit<
  ListWithFiltersState<TItem, TSortValue>,
  "filterValues" | "pendingFilterValues"
> & {
  filterValues: WorkFilterValues;
  pendingFilterValues: WorkFilterValues;
};

/**
 * Common sort types for title-based lists
 */
export type WorkSortType =
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

/**
 * Base type for items that can be grouped by common title sorts
 */
type GroupableWorkItem = {
  grade?: string;
  reviewMonth?: string;
  reviewYear?: string;
  sortTitle: string;
  workYear: string;
};

type PendingFilterGradeAction = {
  type: WorksActions.PENDING_FILTER_GRADE;
  values: [number, number];
};

/**
 * Work-specific action type definitions
 */
type PendingFilterKindAction = {
  type: WorksActions.PENDING_FILTER_KIND;
  value: string;
};

type PendingFilterReviewYearAction = {
  type: WorksActions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

type PendingFilterTitleAction = {
  type: WorksActions.PENDING_FILTER_TITLE;
  value: string;
};

type PendingFilterWorkYearAction = {
  type: WorksActions.PENDING_FILTER_WORK_YEAR;
  values: [string, string];
};

type ShowMoreAction = {
  increment?: number;
  type: WorksActions.SHOW_MORE;
};

/**
 * Creates a pagination-aware group function that slices items before grouping
 */
export function createPaginatedGroupFn<TItem, TSortValue>(
  baseGroupFn: GroupFn<TItem, TSortValue>,
  showCount: number,
): GroupFn<TItem, TSortValue> {
  return (items: TItem[], sortValue: TSortValue) => {
    const paginatedItems = items.slice(0, showCount);
    return baseGroupFn(paginatedItems, sortValue);
  };
}

/**
 * Creates a generic groupForValue function for title-based lists
 */
export function createWorkGroupForValue<
  T extends GroupableWorkItem,
  TSortValue extends WorkSortType,
>(): (value: T, sortValue: TSortValue) => string {
  return (value: T, sortValue: TSortValue): string => {
    switch (sortValue) {
      case "grade-asc":
      case "grade-desc": {
        return value.grade || "Unreviewed";
      }
      case "review-date-asc":
      case "review-date-desc": {
        if (!value.reviewYear) {
          return "Unreviewed";
        }
        if (value.reviewMonth) {
          return `${value.reviewMonth} ${value.reviewYear}`;
        }
        return value.reviewYear;
      }
      case "title-asc":
      case "title-desc": {
        return getGroupLetter(value.sortTitle);
      }
      case "work-year-asc":
      case "work-year-desc": {
        return value.workYear;
      }
    }
  };
}

/**
 * Handle Grade filter action
 */
export function handleGradeFilterAction<
  TItem extends { gradeValue: number },
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: PendingFilterGradeAction,
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const filterFn = createGradeFilter(action.values[0], action.values[1]);
  const filterKey: keyof WorkFilterValues = "grade";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
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
  const filterKey: keyof WorkFilterValues = "kind";
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
  const filterKey: keyof WorkFilterValues = "reviewYear";
  const baseState = updatePendingFilter(
    state,
    filterKey,
    filterFn,
    action.values,
  );
  return extendedState
    ? { ...baseState, ...extendedState }
    : (baseState as ListWithFiltersState<TItem, TSortValue> & TExtendedState);
}

/**
 * Handle "Show More" action for title lists with pagination
 */
export function handleShowMoreAction<
  TItem,
  TSortValue,
  TExtendedState extends { showCount: number },
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: ShowMoreAction,
  groupFn: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const increment = action.increment ?? SHOW_COUNT_DEFAULT;
  return showMore(state, increment, groupFn);
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
  const filterKey: keyof WorkFilterValues = "title";
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
  const filterKey: keyof WorkFilterValues = "workYear";
  const baseState = updatePendingFilter(
    state,
    filterKey,
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
 * Create a Grade filter function
 */
function createGradeFilter(minGradeValue: number, maxGradeValue: number) {
  return <T extends { gradeValue: number }>(item: T) => {
    return item.gradeValue >= minGradeValue && item.gradeValue <= maxGradeValue;
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

/**
 * Handle "Show More" pagination for title lists
 */
function showMore<
  TItem,
  TSortValue,
  TExtendedState extends { showCount: number },
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  increment: number,
  groupFn: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const showCount = state.showCount + increment;
  const groupedValues = groupFn(
    state.filteredValues.slice(0, showCount),
    state.sortValue,
  );

  return {
    ...state,
    groupedValues,
    showCount,
  };
}
