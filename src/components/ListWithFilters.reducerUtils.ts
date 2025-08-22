/**
 * Common reducer utilities and filter handlers.
 *
 * These functions provide reusable logic for common reducer patterns
 * like filtering, sorting, and pagination while maintaining full type safety.
 *
 * Uses consistent generic type parameters:
 * - TItem: The type of items in the list
 * - TSortValue: The type of sort values
 * - TGroupedValues: The type of grouped values structure
 */
import { collator } from "~/utils/collator";

/**
 * Default number of items to show per page for paginated lists
 */
const SHOW_COUNT_DEFAULT = 100;

/**
 * Common Action Types shared across reducers
 */
export enum ListWithFiltersActions {
  APPLY_PENDING_FILTERS = "APPLY_PENDING_FILTERS",
  CLEAR_PENDING_FILTERS = "CLEAR_PENDING_FILTERS",
  PENDING_FILTER_KIND = "PENDING_FILTER_KIND",
  PENDING_FILTER_NAME = "PENDING_FILTER_NAME",
  PENDING_FILTER_REVIEW_YEAR = "PENDING_FILTER_REVIEW_YEAR",
  PENDING_FILTER_TITLE = "PENDING_FILTER_TITLE",
  PENDING_FILTER_WORK_YEAR = "PENDING_FILTER_WORK_YEAR",
  RESET_PENDING_FILTERS = "RESET_PENDING_FILTERS",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type GroupFn<TItem, TSortValue> = (
  items: TItem[],
  sortValue: TSortValue,
) => Map<string, TItem[]>;

/**
 * Union type of all ListWithFilters actions
 */
export type ListWithFiltersActionType<TSortValue = unknown> =
  | ApplyPendingFiltersAction
  | ClearPendingFiltersAction
  | PendingFilterKindAction
  | PendingFilterNameAction
  | PendingFilterReviewYearAction
  | PendingFilterTitleAction
  | PendingFilterWorkYearAction
  | ResetPendingFiltersAction
  | ShowMoreAction
  | SortAction<TSortValue>;

/**
 * Union type for all list states - backwards compatible
 */
export type ListWithFiltersState<TItem, TSortValue> =
  | ListWithFiltersAndShowCountState<TItem, TSortValue>
  | ListWithFiltersOnlyState<TItem, TSortValue>;

/**
 * Common Action Type Definitions
 */
type ApplyPendingFiltersAction = {
  type: ListWithFiltersActions.APPLY_PENDING_FILTERS;
};

/**
 * Base state structure shared by both paginated and non-paginated lists
 */
type BaseListWithFiltersState<TItem, TSortValue> = {
  allValues: TItem[];
  filteredValues: TItem[];
  filters: Record<string, (item: TItem) => boolean>;
  filterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw filter values for UI
  groupedValues: Map<string, TItem[]>;
  hasActiveFilters: boolean;
  pendingFilteredCount: number;
  pendingFilters: Record<string, (item: TItem) => boolean>;
  pendingFilterValues: Record<
    string,
    [number, number] | [string, string] | readonly string[] | string
  >; // Raw pending filter values for UI
  sortValue: TSortValue;
};

type ClearPendingFiltersAction = {
  type: ListWithFiltersActions.CLEAR_PENDING_FILTERS;
};

/**
 * State for lists with pagination ("Show More") enabled
 * The presence of showCount acts as the discriminator
 */
type ListWithFiltersAndShowCountState<TItem, TSortValue> =
  BaseListWithFiltersState<TItem, TSortValue> & {
    showCount: number; // Required for paginated lists
  };

/**
 * State for lists without pagination
 * The absence of showCount (undefined) acts as the discriminator
 */
type ListWithFiltersOnlyState<TItem, TSortValue> = BaseListWithFiltersState<
  TItem,
  TSortValue
> & {
  showCount?: undefined; // Explicitly undefined for non-paginated
};

type PendingFilterKindAction = {
  type: ListWithFiltersActions.PENDING_FILTER_KIND;
  value: string;
};

type PendingFilterNameAction = {
  type: ListWithFiltersActions.PENDING_FILTER_NAME;
  value: string;
};

type PendingFilterReviewYearAction = {
  type: ListWithFiltersActions.PENDING_FILTER_REVIEW_YEAR;
  values: [string, string];
};

type PendingFilterTitleAction = {
  type: ListWithFiltersActions.PENDING_FILTER_TITLE;
  value: string;
};

type PendingFilterWorkYearAction = {
  type: ListWithFiltersActions.PENDING_FILTER_WORK_YEAR;
  values: [string, string];
};

type ResetPendingFiltersAction = {
  type: ListWithFiltersActions.RESET_PENDING_FILTERS;
};

type ShowMoreAction = {
  increment?: number;
  type: ListWithFiltersActions.SHOW_MORE;
};

type SortAction<TSortValue> = {
  type: ListWithFiltersActions.SORT;
  value: TSortValue;
};

/**
 * Build group values helper - groups items by a key function
 */
export function buildGroupValues<TItem, TSortValue>(
  keyFn: (item: TItem, sortValue: TSortValue) => string,
): GroupFn<TItem, TSortValue> {
  return function groupValues(
    items: TItem[],
    sortValue: TSortValue,
  ): Map<string, TItem[]> {
    const grouped = new Map<string, TItem[]>();

    for (const item of items) {
      const key = keyFn(item, sortValue);
      const group = grouped.get(key) || [];
      group.push(item);
      grouped.set(key, group);
    }

    return grouped;
  };
}

export function buildSortValues<V, S extends string>(
  sortMap: Record<S, (a: V, b: V) => number>,
) {
  return (values: V[], sortOrder: S): V[] => {
    const comparer = sortMap[sortOrder];
    return [...values].sort(comparer);
  };
}

/**
 * Helper to create initial state with pending filters support
 */
export function createInitialState<TItem, TSortValue>({
  groupFn,
  initialSort,
  showMoreEnabled = true,
  sortFn,
  values,
}: {
  groupFn?: GroupFn<TItem, TSortValue>;
  initialSort: TSortValue;
  showMoreEnabled?: boolean;
  sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  values: TItem[];
}): ListWithFiltersState<TItem, TSortValue> {
  const sortedValues = sortFn(values, initialSort);
  const showCount = showMoreEnabled ? SHOW_COUNT_DEFAULT : undefined;
  const valuesToGroup = showCount
    ? sortedValues.slice(0, showCount)
    : sortedValues;
  const groupedValues = groupFn
    ? groupFn(valuesToGroup, initialSort)
    : new Map<string, TItem[]>();

  return {
    allValues: values,
    filteredValues: sortedValues,
    filters: {},
    filterValues: {},
    groupedValues,
    hasActiveFilters: false,
    pendingFilteredCount: sortedValues.length,
    pendingFilters: {},
    pendingFilterValues: {},
    showCount,
    sortValue: initialSort,
  };
}

/**
 * Gets the group letter for a given string, typically used for alphabetical grouping.
 * Non-alphabetic characters are grouped under "#".
 *
 * @param str - The string to get the group letter from
 * @returns The uppercase first letter or "#" for non-alphabetic characters
 */
export function getGroupLetter(str: string): string {
  const letter = str.slice(0, 1);

  // Check if the character is non-alphabetic (same in upper and lower case)
  if (letter.toLowerCase() === letter.toUpperCase()) {
    return "#";
  }

  return letter.toLocaleUpperCase();
}

/**
 * Field-specific filter handlers that require specific item properties
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
 * Shared reducer handler for list structure actions that don't require item values
 */
export function handleListWithFiltersAction<
  TItem,
  TSortValue,
  TExtendedState extends Record<string, unknown> = Record<string, never>,
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  action: ListWithFiltersActionType<TSortValue>,
  handlers: {
    groupFn?: GroupFn<TItem, TSortValue>;
    sortFn: (values: TItem[], sort: TSortValue) => TItem[];
  },
  extendedState?: TExtendedState,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  switch (action.type) {
    case ListWithFiltersActions.APPLY_PENDING_FILTERS: {
      const baseState = applyPendingFilters(
        state,
        handlers.sortFn,
        handlers.groupFn,
      );
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    case ListWithFiltersActions.CLEAR_PENDING_FILTERS: {
      const baseState = clearPendingFilters(state);
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    case ListWithFiltersActions.RESET_PENDING_FILTERS: {
      const baseState = resetPendingFilters(state);
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    case ListWithFiltersActions.SHOW_MORE: {
      if (state.showCount !== undefined) {
        const increment = action.increment ?? SHOW_COUNT_DEFAULT;
        const baseState = showMore(state, increment, handlers.groupFn);
        return extendedState
          ? { ...baseState, ...extendedState }
          : (baseState as ListWithFiltersState<TItem, TSortValue> &
              TExtendedState);
      }
      return state;
    }

    case ListWithFiltersActions.SORT: {
      const baseState = updateSort(
        state,
        action.value,
        handlers.sortFn,
        handlers.groupFn,
      );
      return extendedState
        ? { ...baseState, ...extendedState }
        : (baseState as ListWithFiltersState<TItem, TSortValue> &
            TExtendedState);
    }

    default: {
      return state;
    }
  }
}

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

export function handleToggleReviewedAction<
  TItem extends { slug?: string },
  TSortValue,
  TExtendedState extends { hideReviewed: boolean },
>(
  state: ListWithFiltersState<TItem, TSortValue> & TExtendedState,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn?: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> & TExtendedState {
  const hideReviewed = !state.hideReviewed;

  const filters = hideReviewed
    ? {
        ...state.filters,
        hideReviewed: (value: TItem) => !value.slug,
      }
    : (() => {
        const newFilters = { ...state.filters };
        delete newFilters.hideReviewed;
        return newFilters;
      })();

  const pendingFilters = hideReviewed
    ? {
        ...state.pendingFilters,
        hideReviewed: (value: TItem) => !value.slug,
      }
    : (() => {
        const newFilters = { ...state.pendingFilters };
        delete newFilters.hideReviewed;
        return newFilters;
      })();

  const filteredValues = sortFn(
    filterValues({ filters, values: state.allValues }),
    state.sortValue,
  );

  const pendingFilteredCount = filterValues({
    filters: pendingFilters,
    values: state.allValues,
  }).length;

  const valuesToGroup = state.showCount
    ? filteredValues.slice(0, state.showCount)
    : filteredValues;

  return {
    ...state,
    filteredValues,
    filters,
    groupedValues: groupFn
      ? groupFn(valuesToGroup, state.sortValue)
      : new Map<string, TItem[]>(),
    hideReviewed,
    pendingFilteredCount,
    pendingFilters,
  };
}

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

export function sortGrade<T extends { gradeValue?: null | number }>() {
  return {
    "grade-asc": (a: T, b: T) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0),
    "grade-desc": (a: T, b: T) =>
      sortNumber(a.gradeValue || 0, b.gradeValue || 0) * -1,
  };
}

export function sortName<T extends { name: string }>() {
  return {
    "name-asc": (a: T, b: T) => sortString(a.name, b.name),
    "name-desc": (a: T, b: T) => sortString(a.name, b.name) * -1,
  };
}

export function sortNumber(a: number, b: number): number {
  return a - b;
}

export function sortReviewCount<T extends { reviewCount: number }>() {
  return {
    "review-count-asc": (a: T, b: T) =>
      sortNumber(a.reviewCount, b.reviewCount),
    "review-count-desc": (a: T, b: T) =>
      sortNumber(a.reviewCount, b.reviewCount) * -1,
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

export function sortString(a: string, b: string): number {
  return collator.compare(a, b);
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
 * Update a pending filter
 */
export function updatePendingFilter<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  key: string,
  filterFn: ((item: TItem) => boolean) | undefined,
  value:
    | [number, number]
    | [string, string]
    | readonly string[]
    | string
    | undefined,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilters = { ...state.pendingFilters };
  const pendingFilterValues = { ...state.pendingFilterValues };

  if (filterFn === undefined || value === undefined) {
    delete pendingFilters[key];
    delete pendingFilterValues[key];
  } else {
    pendingFilters[key] = filterFn;
    pendingFilterValues[key] = value;
  }

  const pendingFilteredCount = filterValues({
    filters: pendingFilters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(pendingFilterValues).length > 0,
    pendingFilteredCount,
    pendingFilters,
    pendingFilterValues,
  };
}

/**
 * Apply pending filters to become active filters
 */
function applyPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn?: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(
    filterValues({
      filters: state.pendingFilters,
      values: state.allValues,
    }),
    state.sortValue,
  );

  const valuesToGroup = state.showCount
    ? filteredValues.slice(0, state.showCount)
    : filteredValues;
  const groupedValues = groupFn
    ? groupFn(valuesToGroup, state.sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    filteredValues,
    filters: { ...state.pendingFilters },
    filterValues: { ...state.pendingFilterValues },
    groupedValues,
    hasActiveFilters: Object.keys(state.pendingFilterValues).length > 0,
    pendingFilteredCount: filteredValues.length,
  };
}

/**
 * Clear all pending filters
 */
function clearPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = state.allValues.length;

  return {
    ...state,
    hasActiveFilters: false,
    pendingFilteredCount,
    pendingFilters: {},
    pendingFilterValues: {},
  };
}

function createKindFilter(kind: string) {
  return <T extends { kind: string }>(item: T) => {
    return kind == "All" || item.kind == kind;
  };
}

function createNameFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { name: string }>(item: T) => regex.test(item.name);
}

function createReviewYearFilter(minYear: string, maxYear: string) {
  return <T extends { reviewYear?: string }>(item: T) => {
    const year = item.reviewYear;
    if (!year) return false;
    return year >= minYear && year <= maxYear;
  };
}

// Common filter creators - simple functions that create filter functions
function createTitleFilter(value: string | undefined) {
  if (!value) return;
  const regex = new RegExp(value, "i");
  return <T extends { title: string }>(item: T) => regex.test(item.title);
}

function createWorkYearFilter(minYear: string, maxYear: string) {
  return <T extends { workYear: string }>(item: T) => {
    return item.workYear >= minYear && item.workYear <= maxYear;
  };
}

/**
 * Handler functions that combine filter creation and state updates
 */

// Filter values helper
function filterValues<TItem>({
  filters,
  values,
}: {
  filters: Record<string, (arg0: TItem) => boolean>;
  values: readonly TItem[];
}): TItem[] {
  return values.filter((item) => {
    return Object.values(filters).every((filter) => {
      return filter(item);
    });
  });
}

/**
 * Reset pending filters to current active filters
 */
function resetPendingFilters<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const pendingFilteredCount = filterValues({
    filters: state.filters,
    values: state.allValues,
  }).length;

  return {
    ...state,
    hasActiveFilters: Object.keys(state.filterValues).length > 0,
    pendingFilteredCount,
    pendingFilters: { ...state.filters },
    pendingFilterValues: { ...state.filterValues },
  };
}

/**
 * Handle "Show More" pagination - only accepts paginated states
 */
function showMore<TItem, TSortValue>(
  state: ListWithFiltersAndShowCountState<TItem, TSortValue>,
  increment: number,
  groupFn?: GroupFn<TItem, TSortValue>,
): ListWithFiltersAndShowCountState<TItem, TSortValue> {
  const showCount = state.showCount + increment;
  const groupedValues = groupFn
    ? groupFn(state.filteredValues.slice(0, showCount), state.sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    groupedValues,
    showCount,
  };
}

/**
 * Handle sorting
 */
function updateSort<TItem, TSortValue>(
  state: ListWithFiltersState<TItem, TSortValue>,
  sortValue: TSortValue,
  sortFn: (values: TItem[], sort: TSortValue) => TItem[],
  groupFn?: GroupFn<TItem, TSortValue>,
): ListWithFiltersState<TItem, TSortValue> {
  const filteredValues = sortFn(state.filteredValues, sortValue);
  const valuesToGroup = state.showCount
    ? filteredValues.slice(0, state.showCount)
    : filteredValues;
  const groupedValues = groupFn
    ? groupFn(valuesToGroup, sortValue)
    : new Map<string, TItem[]>();

  return {
    ...state,
    filteredValues,
    groupedValues,
    sortValue,
  };
}
