import type {
  GroupFn,
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/reducerUtils";
import type { WorksFilterActionType } from "~/components/ListWithFilters/worksReducerUtils";

import {
  buildSortValues,
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  updatePendingFilter,
} from "~/components/ListWithFilters/reducerUtils";
import {
  handleKindFilterAction,
  handleTitleFilterAction,
  handleWorkYearFilterAction,
  WorksFilterActions,
} from "~/components/ListWithFilters/worksReducerUtils";

import type { ListItemValue } from "./Readings";

enum ReadingsActions {
  NEXT_MONTH = "NEXT_MONTH",
  PENDING_FILTER_EDITION = "PENDING_FILTER_EDITION",
  PENDING_FILTER_READING_YEAR = "PENDING_FILTER_READING_YEAR",
  PREV_MONTH = "PREV_MONTH",
}

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...WorksFilterActions,
  ...ReadingsActions,
} as const;

export type ActionType =
  | ListWithFiltersActionType<Sort>
  | NextMonthAction
  | PendingFilterEditionAction
  | PendingFilterReadingYearAction
  | PrevMonthAction
  | WorksFilterActionType;

export type Sort = "reading-date-asc" | "reading-date-desc";

// Using shared action types from ListWithFilters

type NextMonthAction = {
  type: ReadingsActions.NEXT_MONTH;
};

type PendingFilterEditionAction = {
  type: ReadingsActions.PENDING_FILTER_EDITION;
  value: string;
};

// Using shared PendingFilterReleaseYearAction from ListWithFilters

// Using the shared PendingFilterTitleAction from ListWithFilters

type PendingFilterReadingYearAction = {
  type: ReadingsActions.PENDING_FILTER_READING_YEAR;
  values: string[];
};

type PrevMonthAction = {
  type: ReadingsActions.PREV_MONTH;
};

// AIDEV-NOTE: Readings state extends ListWithFiltersState with month navigation
type State = ListWithFiltersState<ListItemValue, Sort> & {
  currentMonth: Date;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  monthReadings: ListItemValue[];
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const baseState = createInitialState({
    groupFn: groupValuesSortedBySequence,
    initialSort,
    sortFn: sortValues,
    values,
  });

  const currentMonth = getInitialMonth(baseState.filteredValues, initialSort);
  const monthReadings = getMonthReadings(
    baseState.filteredValues,
    currentMonth,
  );
  const nextMonth = getNextMonthWithReadings(
    currentMonth,
    baseState.filteredValues,
  );
  const prevMonth = getPrevMonthWithReadings(
    currentMonth,
    baseState.filteredValues,
  );

  return {
    ...baseState,
    currentMonth,
    hasNextMonth: nextMonth !== undefined,
    hasPrevMonth: prevMonth !== undefined,
    monthReadings,
    nextMonth,
    prevMonth,
  };
}

export function reducer(state: State, action: ActionType): State {
  let newMonth;

  switch (action.type) {
    case ReadingsActions.NEXT_MONTH: {
      newMonth = getNextMonthWithReadings(
        state.currentMonth,
        state.filteredValues,
      )!; // Bang operator - we know this exists because button is only rendered when hasNextMonth is true
      const nextMonthNext = getNextMonthWithReadings(
        newMonth,
        state.filteredValues,
      );
      const nextMonthPrev = getPrevMonthWithReadings(
        newMonth,
        state.filteredValues,
      );
      return {
        ...state,
        currentMonth: newMonth,
        hasNextMonth: nextMonthNext !== undefined,
        hasPrevMonth: nextMonthPrev !== undefined,
        monthReadings: getMonthReadings(state.filteredValues, newMonth),
        nextMonth: nextMonthNext,
        prevMonth: nextMonthPrev,
      };
    }

    case ReadingsActions.PENDING_FILTER_EDITION: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ListItemValue) => value.edition == action.value
          : undefined;
      return {
        ...updatePendingFilter(state, "edition", filterFn, action.value),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthReadings: state.monthReadings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      };
    }

    case ReadingsActions.PENDING_FILTER_READING_YEAR: {
      const [minYear, maxYear] = action.values;
      const filterFn = (value: ListItemValue) =>
        value.readingYear >= minYear && value.readingYear <= maxYear;
      return {
        ...updatePendingFilter(state, "readingYears", filterFn, action.values),
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthReadings: state.monthReadings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      };
    }

    case ReadingsActions.PREV_MONTH: {
      newMonth = getPrevMonthWithReadings(
        state.currentMonth,
        state.filteredValues,
      )!; // Bang operator - we know this exists because button is only rendered when hasPrevMonth is true
      const prevMonthNext = getNextMonthWithReadings(
        newMonth,
        state.filteredValues,
      );
      const prevMonthPrev = getPrevMonthWithReadings(
        newMonth,
        state.filteredValues,
      );
      return {
        ...state,
        currentMonth: newMonth,
        hasNextMonth: prevMonthNext !== undefined,
        hasPrevMonth: prevMonthPrev !== undefined,
        monthReadings: getMonthReadings(state.filteredValues, newMonth),
        nextMonth: prevMonthNext,
        prevMonth: prevMonthPrev,
      };
    }
    case WorksFilterActions.PENDING_FILTER_KIND: {
      return handleKindFilterAction(state, action, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthReadings: state.monthReadings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      });
    }

    case WorksFilterActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthReadings: state.monthReadings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      });
    }

    // Field-specific shared filters
    case WorksFilterActions.PENDING_FILTER_WORK_YEAR: {
      return handleWorkYearFilterAction(state, action, {
        currentMonth: state.currentMonth,
        hasNextMonth: state.hasNextMonth,
        hasPrevMonth: state.hasPrevMonth,
        monthReadings: state.monthReadings,
        nextMonth: state.nextMonth,
        prevMonth: state.prevMonth,
      });
    }

    default: {
      // Handle shared list structure actions
      const result = handleListWithFiltersAction(
        state,
        action as ListWithFiltersActionType<Sort>,
        { groupFn: groupValuesSortedBySequence, sortFn: sortValues },
        {
          currentMonth: state.currentMonth,
          hasNextMonth: state.hasNextMonth,
          hasPrevMonth: state.hasPrevMonth,
          monthReadings: state.monthReadings,
          nextMonth: state.nextMonth,
          prevMonth: state.prevMonth,
        },
      );

      // Update month-related state on APPLY_PENDING_FILTERS and SORT
      if (
        action.type === ListWithFiltersActions.APPLY_PENDING_FILTERS ||
        action.type === ListWithFiltersActions.SORT
      ) {
        // Always reset to initial month based on filtered results and sort order
        const newMonth = getInitialMonth(
          result.filteredValues,
          result.sortValue,
        );

        const newNextMonth = getNextMonthWithReadings(
          newMonth,
          result.filteredValues,
        );
        const newPrevMonth = getPrevMonthWithReadings(
          newMonth,
          result.filteredValues,
        );

        return {
          ...result,
          currentMonth: newMonth,
          hasNextMonth: newNextMonth !== undefined,
          hasPrevMonth: newPrevMonth !== undefined,
          monthReadings: getMonthReadings(result.filteredValues, newMonth),
          nextMonth: newNextMonth,
          prevMonth: newPrevMonth,
        };
      }

      return result;
    }
  }
}

// Determine initial month based on sort order
function getInitialMonth(values: ListItemValue[], sortValue: Sort): Date {
  if (values.length === 0) {
    return new Date();
  }

  return sortValue === "reading-date-asc"
    ? getOldestMonth(values)
    : getMostRecentMonth(values);
}

function getMonthReadings(
  values: ListItemValue[],
  month: Date,
): ListItemValue[] {
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();

  return values.filter((value) => {
    const readingDate = new Date(value.readingDate);
    return (
      readingDate.getUTCFullYear() === year &&
      readingDate.getUTCMonth() === monthIndex
    );
  });
}

// Get all months that have readings
function getMonthsWithReadings(values: ListItemValue[]): Set<string> {
  const months = new Set<string>();
  for (const value of values) {
    const date = new Date(value.readingDate);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    months.add(monthKey);
  }
  return months;
}

function getMostRecentMonth(values: ListItemValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the most recent reading date
  // Note: Higher timelineSequence = more recent
  const sortedValues = [...values].sort(
    (a, b) => b.timelineSequence - a.timelineSequence,
  );
  const mostRecentDate = new Date(sortedValues[0].readingDate);

  // Create a UTC date for the first day of that month
  return new Date(
    Date.UTC(mostRecentDate.getUTCFullYear(), mostRecentDate.getUTCMonth(), 1),
  );
}

// Get next month that has readings
function getNextMonthWithReadings(
  currentMonth: Date,
  values: ListItemValue[],
): Date | undefined {
  const monthsWithReadings = getMonthsWithReadings(values);
  let checkMonth = new Date(currentMonth);
  const mostRecent = getMostRecentMonth(values);

  while (checkMonth < mostRecent) {
    checkMonth = new Date(
      Date.UTC(checkMonth.getUTCFullYear(), checkMonth.getUTCMonth() + 1, 1),
    );
    const monthKey = `${checkMonth.getUTCFullYear()}-${checkMonth.getUTCMonth()}`;
    if (monthsWithReadings.has(monthKey)) {
      return checkMonth;
    }
  }
  return undefined;
}

function getOldestMonth(values: ListItemValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the oldest reading date
  // Note: Lower timelineSequence = older
  const sortedValues = [...values].sort(
    (a, b) => a.timelineSequence - b.timelineSequence,
  );
  const oldestDate = new Date(sortedValues[0].readingDate);

  // Create a UTC date for the first day of that month
  return new Date(
    Date.UTC(oldestDate.getUTCFullYear(), oldestDate.getUTCMonth(), 1),
  );
}

// Get previous month that has reading
function getPrevMonthWithReadings(
  currentMonth: Date,
  values: ListItemValue[],
): Date | undefined {
  const monthsWithReadings = getMonthsWithReadings(values);
  let checkMonth = new Date(currentMonth);
  const oldest = getOldestMonth(values);

  while (checkMonth > oldest) {
    checkMonth = new Date(
      Date.UTC(checkMonth.getUTCFullYear(), checkMonth.getUTCMonth() - 1, 1),
    );
    const monthKey = `${checkMonth.getUTCFullYear()}-${checkMonth.getUTCMonth()}`;
    if (monthsWithReadings.has(monthKey)) {
      return checkMonth;
    }
  }
  return undefined;
}

// AIDEV-NOTE: Group readings by date for calendar display
// Creates a map where keys are "year-month-day" and values are arrays of readings for that day
function groupByDate(value: ListItemValue): string {
  const date = new Date(value.readingDate);
  // Key format: "year-month-day" without padding (matches calendar lookup needs)
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

// Custom grouping function that sorts readings within each day by sequence
// The sortValue parameter is required by the groupFn interface but not used here
const groupValuesSortedBySequence: GroupFn<ListItemValue, Sort> = (
  items: ListItemValue[],
): Map<string, ListItemValue[]> => {
  const grouped = new Map<string, ListItemValue[]>();

  for (const item of items) {
    const key = groupByDate(item);
    const group = grouped.get(key) || [];
    group.push(item);
    grouped.set(key, group);
  }

  // Sort readings within each day by sequence (higher sequence = older, so reverse sort)
  for (const dayReadings of grouped.values()) {
    dayReadings.sort((a, b) => a.timelineSequence - b.timelineSequence);
  }

  return grouped;
};

const sortValues = buildSortValues<ListItemValue, Sort>({
  // Note: Lower timelineSequence = older date (in real data)
  "reading-date-asc": (a, b) => a.timelineSequence - b.timelineSequence, // Oldest first
  "reading-date-desc": (a, b) => b.timelineSequence - a.timelineSequence, // Newest first
});
