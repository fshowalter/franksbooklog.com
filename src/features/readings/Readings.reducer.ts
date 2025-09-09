import {
  createInitialWorkFiltersState,
  createSortActionCreator,
  createWorkFiltersReducer,
  updatePendingFilter,
  type WorkFiltersActionType,
  type WorkFiltersState,
  type WorkFiltersValues,
} from "~/components/filter-and-sort/WorkFilters.reducer";

/**
 * Action creators for managing readings page filters.
 * Re-exported from the shared WorkFilters reducer.
 */
export {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSetKindPendingFilterAction,
  createSetTitlePendingFilterAction,
  createSetWorkYearPendingFilterAction,
} from "~/components/filter-and-sort/WorkFilters.reducer";

import { FiltersActions } from "~/components/filter-and-sort/filters.reducer";

import type { ReadingsValue } from "./Readings";
import type { ReadingsSort } from "./Readings.sorter";

/**
 * Enum defining readings-specific action types for month navigation and filtering
 */
enum ReadingsActions {
  Next_Month = "readings/nextMonth",
  Previous_Month = "readings/previousMonth",
  Set_Edition_Pending_Filter = "readings/setEditionPendingFilter",
  Set_Reading_Year_Pending_Filter = "readings/setReadingYearPendingFilter",
}

/**
 * Union type of all possible actions for readings page state management
 */
export type ReadingsActionType =
  | NextMonthAction
  | PreviousMonthAction
  | SetEditionPendingFilterAction
  | SetReadingYearPendingFilterAction
  | WorkFiltersActionType<ReadingsSort>;

/**
 * Filter values type for readings page, extending base work filters with reading-specific options
 */
export type ReadingsFiltersValues = WorkFiltersValues & {
  /** Selected edition filter */
  edition?: string;
  /** Selected reading years for filtering */
  readingYear?: string[];
};

type NextMonthAction = {
  type: ReadingsActions.Next_Month;
};

type PreviousMonthAction = {
  type: ReadingsActions.Previous_Month;
};

type ReadingsState = WorkFiltersState<ReadingsValue, ReadingsSort> & {
  currentMonth: Date;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  monthReadings: ReadingsValue[];
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

type SetEditionPendingFilterAction = {
  type: ReadingsActions.Set_Edition_Pending_Filter;
  value: string;
};

type SetReadingYearPendingFilterAction = {
  type: ReadingsActions.Set_Reading_Year_Pending_Filter;
  values: string[];
};

export function initState({
  initialSort,
  values,
}: {
  initialSort: ReadingsSort;
  values: ReadingsValue[];
}): ReadingsState {
  const workFilterState = createInitialWorkFiltersState({
    initialSort,
    values,
  });

  const currentMonth = getInitialMonth(
    workFilterState.filteredValues,
    initialSort,
  );
  const monthReadings = getMonthReadings(
    workFilterState.filteredValues,
    currentMonth,
  );
  const nextMonth = getNextMonthWithReadings(
    currentMonth,
    workFilterState.filteredValues,
  );
  const prevMonth = getPrevMonthWithReadings(
    currentMonth,
    workFilterState.filteredValues,
  );

  return {
    ...workFilterState,
    currentMonth,
    hasNextMonth: nextMonth !== undefined,
    hasPrevMonth: prevMonth !== undefined,
    monthReadings,
    nextMonth,
    prevMonth,
  };
}

const workFiltersReducer = createWorkFiltersReducer<
  ReadingsValue,
  ReadingsSort,
  ReadingsState
>();

export function createNextMonthAction(): NextMonthAction {
  return { type: ReadingsActions.Next_Month };
}

export function createPreviousMonthAction(): PreviousMonthAction {
  return { type: ReadingsActions.Previous_Month };
}

export function createSetEditionPendingFilterAction(
  value: string,
): SetEditionPendingFilterAction {
  return { type: ReadingsActions.Set_Edition_Pending_Filter, value };
}

export function createSetReadingYearPendingFilterAction(
  values: [string, string],
): SetReadingYearPendingFilterAction {
  return { type: ReadingsActions.Set_Reading_Year_Pending_Filter, values };
}

export const createSortAction = createSortActionCreator<ReadingsSort>();

export function readingsReducer(
  state: ReadingsState,
  action: ReadingsActionType,
): ReadingsState {
  let newMonth;

  switch (action.type) {
    case ReadingsActions.Next_Month: {
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

    case ReadingsActions.Previous_Month: {
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

    case ReadingsActions.Set_Edition_Pending_Filter: {
      const filterFn =
        action.value && action.value !== "All"
          ? (value: ReadingsValue) => value.edition == action.value
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

    case ReadingsActions.Set_Reading_Year_Pending_Filter: {
      const [minYear, maxYear] = action.values;
      const filterFn = (value: ReadingsValue) =>
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

    default: {
      const newState = workFiltersReducer(state, action);

      switch (action.type) {
        case FiltersActions.Apply_Pending_Filters:
        case FiltersActions.Sort: {
          const currentMonth = getInitialMonth(
            newState.filteredValues,
            newState.sort,
          );
          const monthReadings = getMonthReadings(
            newState.filteredValues,
            currentMonth,
          );
          const nextMonth = getNextMonthWithReadings(
            currentMonth,
            newState.filteredValues,
          );
          const prevMonth = getPrevMonthWithReadings(
            currentMonth,
            newState.filteredValues,
          );

          return {
            ...newState,
            currentMonth,
            hasNextMonth: nextMonth !== undefined,
            hasPrevMonth: prevMonth !== undefined,
            monthReadings,
            nextMonth,
            prevMonth,
          };
        }
      }

      return newState;
    }
  }
}

// Determine initial month based on sort order
function getInitialMonth(
  values: ReadingsValue[],
  sortValue: ReadingsSort,
): Date {
  if (values.length === 0) {
    return new Date();
  }

  return sortValue === "reading-date-asc"
    ? getOldestMonth(values)
    : getMostRecentMonth(values);
}

function getMonthReadings(
  values: ReadingsValue[],
  month: Date,
): ReadingsValue[] {
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
function getMonthsWithReadings(values: ReadingsValue[]): Set<string> {
  const months = new Set<string>();
  for (const value of values) {
    const date = new Date(value.readingDate);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    months.add(monthKey);
  }
  return months;
}

function getMostRecentMonth(values: ReadingsValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the most recent reading date
  // Note: Higher timelineSequence = more recent
  const sortedValues = [...values].toSorted(
    (a, b) => b.entrySequence - a.entrySequence,
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
  values: ReadingsValue[],
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

function getOldestMonth(values: ReadingsValue[]): Date {
  if (values.length === 0) {
    return new Date();
  }

  // Get the oldest reading date
  // Note: Lower timelineSequence = older
  const sortedValues = [...values].toSorted(
    (a, b) => a.entrySequence - b.entrySequence,
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
  values: ReadingsValue[],
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
