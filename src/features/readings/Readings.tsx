import { useEffect, useReducer, useRef, useState } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { TimelineEntry } from "~/api/timelineEntries";

import { Abandoned } from "~/components/Abandoned";
import { BarGradient } from "~/components/BarGradient";
import { CoverListItem } from "~/components/CoverList";
import { FilterAndSortContainer } from "~/components/FilterAndSort/FilterAndSortContainer";
import { FilterAndSortHeaderLink } from "~/components/FilterAndSort/FilterAndSortHeaderLink";
import { ListItemAuthors } from "~/components/ListItemAuthors";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListHeaderButton,
  ListWithFilters,
} from "~/components/ListWithFilters/ListWithFilters";

import type { ReadingsSort } from "./Readings.sorter";

import { Filters } from "./Filters";
import { MonthNavHeader } from "./MonthNavHeader";
import {
  Actions,
  type ActionType,
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  initState,
  readingsReducer,
  reducer,
  type Sort,
} from "./Readings.reducer";

export type ReadingsValue = {
  authors: { name: string }[];
  coverImageProps: CoverImageProps;
  edition: string;
  kind: string;
  progress: string;
  readingDate: string; // Full date string YYYY-MM-DD
  readingDay: string;
  readingMonth: string;
  readingMonthShort: string;
  readingYear: string;
  reviewed: boolean;
  slug: string;
  timelineSequence: number;
  title: string;
  workYear: string;
};

export const ReadingsItemImageConfig = {
  height: 375,
  sizes:
    "(min-width: 1800px) 216px, (min-width: 1380px) calc(13.25vw - 20px), (min-width: 1280px) calc(20vw - 70px), (min-width: 1060px) calc(20vw - 57px), (min-width: 800px) calc(25vw - 60px), (min-width: 680px) calc(33vw - 61px), calc(23.06vw + 4px)",
  width: 250,
};

export type ReadingsProps = {
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  initialSort: ReadingsSort;
  values: ReadingsValue[];
};

type CalendarDayData = {
  date: number | undefined;
  readings: ListItemValue[];
  weekday?: string;
};

type CalendarHeaderProps = {
  currentMonth: Date;
  dispatch: React.Dispatch<ActionType>;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

type CalendarMonthProps = {
  currentMonth: Date;
  groupedValues: Map<string, ListItemValue[]>;
};

type CalendarViewProps = {
  currentMonth: Date;
  dispatch: React.Dispatch<ActionType>;
  groupedValues: Map<string, ListItemValue[]>;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

export function Readings({
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  initialSort,
  values,
}: ReadingsProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    readingsReducer,
    {
      initialSort,
      values,
    },
    initState,
  );
  const [filterKey, setFilterKey] = useState(0);
  const prevMonthRef = useRef(state.currentMonth);

  // Scroll to top of calendar when month changes
  useEffect(() => {
    if (prevMonthRef.current.getTime() !== state.currentMonth.getTime()) {
      prevMonthRef.current = state.currentMonth;
      if (typeof document !== "undefined") {
        document
          .querySelector("#calendar")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [state.currentMonth]);

  return (
    <FilterAndSortContainer
      filters={
        <Filters
          dispatch={dispatch}
          distinctEditions={distinctEditions}
          distinctKinds={distinctKinds}
          distinctReadingYears={distinctReadingYears}
          distinctWorkYears={distinctWorkYears}
          filterValues={state.pendingFilterValues}
          key={filterKey}
        />
      }
      hasActiveFilters={state.hasActiveFilters}
      headerLinks={
        <FilterAndSortHeaderLink href="/readings/stats/" text="stats" />
      }
      onApplyFilters={() => dispatch(createApplyPendingFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearPendingFiltersAction());
        setFilterKey((prev) => prev + 1);
      }}
      onFilterDrawerOpen={() => {
        // Increment key to force remount of filter components
        setFilterKey((prev) => prev + 1);
        dispatch(createResetPendingFiltersAction());
      }}
      onResetFilters={() => dispatch(createResetPendingFiltersAction())}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as ReadingsSort,
          }),
        sortOptions: (
          <>
            <option value="reading-date-desc">
              Reading Date (Newest First)
            </option>
            <option value="reading-date-asc">
              Reading Date (Oldest First)
            </option>
          </>
        ),
      }}
      totalCount={state.filteredValues.length}
    >
      <CalendarView
        currentMonth={state.currentMonth}
        dispatch={dispatch}
        groupedValues={state.groupedValues}
        hasNextMonth={state.hasNextMonth}
        hasPrevMonth={state.hasPrevMonth}
        nextMonth={state.nextMonth}
        prevMonth={state.prevMonth}
      />
    </FilterAndSortContainer>
  );
}

function CalendarMonth({
  currentMonth,
  groupedValues,
}: CalendarMonthProps): React.JSX.Element {
  const calendarDays = getCalendarDays(currentMonth, groupedValues);
  const weeks = getCalendarWeeks(calendarDays);

  return (
    <div
      className={`
        scroll-mt-(--calendar-scroll-offset)
        [--calendar-scroll-offset:calc(var(--list-scroll-offset)_+_92px)]
        tablet:mt-8
        tablet-landscape:mt-16
      `}
      data-testid="calendar"
      id="calendar"
    >
      <table
        className={`
          w-full border-default
          tablet-landscape:border-collapse tablet-landscape:border
        `}
      >
        <thead
          className={`
            hidden transform-gpu bg-calendar
            tablet-landscape:sticky
            tablet-landscape:top-(--calendar-scroll-offset)
            tablet-landscape:z-sticky tablet-landscape:table-header-group
          `}
        >
          <tr className={`tablet-landscape:shadow-all`}>
            <WeekdayHeader>Sun</WeekdayHeader>
            <WeekdayHeader> Mon</WeekdayHeader>
            <WeekdayHeader>Tue</WeekdayHeader>
            <WeekdayHeader>Wed</WeekdayHeader>
            <WeekdayHeader>Thu</WeekdayHeader>
            <WeekdayHeader>Fri</WeekdayHeader>
            <WeekdayHeader>Sat</WeekdayHeader>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr className="tablet-landscape:table-row" key={weekIndex}>
              {week.map((day, dayIndex) => (
                <CalendarDay day={day} key={`${weekIndex}-${dayIndex}`} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarView({
  currentMonth,
  dispatch,
  groupedValues,
  hasNextMonth,
  hasPrevMonth,
  nextMonth,
  prevMonth,
}: CalendarViewProps): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-(--breakpoint-desktop)">
      <MonthNavHeader
        currentMonth={currentMonth}
        dispatch={dispatch}
        hasNextMonth={hasNextMonth}
        hasPrevMonth={hasPrevMonth}
        nextMonth={nextMonth}
        prevMonth={prevMonth}
      />
      <CalendarMonth
        currentMonth={currentMonth}
        groupedValues={groupedValues}
      />
    </div>
  );
}

function getCalendarDays(
  month: Date,
  groupedValues: Map<string, ListItemValue[]>,
): CalendarDayData[] {
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  const startPadding = firstDay.getUTCDay();
  const daysInMonth = lastDay.getUTCDate();

  const days: CalendarDayData[] = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add empty cells for days before month starts
  for (let i = 0; i < startPadding; i++) {
    days.push({ date: undefined, readings: [] });
  }

  // Add days of the month
  for (let date = 1; date <= daysInMonth; date++) {
    const currentDate = new Date(Date.UTC(year, monthIndex, date));
    const weekday = weekdays[currentDate.getUTCDay()];

    // Use pre-indexed viewings for O(1) lookup
    // Key format: "year-month-day" without padding
    const dateKey = `${year}-${monthIndex + 1}-${date}`;
    const dayReadings = groupedValues.get(dateKey) || [];
    // Viewings are already sorted in the reducer

    days.push({
      date,
      readings: dayReadings,
      weekday,
    });
  }

  // Fill remaining cells to complete the grid
  while (days.length % 7 !== 0) {
    days.push({ date: undefined, readings: [] });
  }

  return days;
}

function getCalendarWeeks(days: CalendarDayData[]): CalendarDayData[][] {
  const weeks: CalendarDayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

function parseProgress(progress: string): number {
  const progressNumber = progress.split("%", 1)[0];

  if (progressNumber === "Finished") {
    return 100;
  }

  if (!Number.isNaN(Number(progressNumber))) {
    return Number.parseInt(progressNumber);
  }

  return 100;
}

function WeekdayHeader({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <th
      className={`
        border-separate border border-default px-2 py-3 text-center font-sans
        text-sm font-normal tracking-wide text-subtle uppercase
      `}
    >
      {children}
    </th>
  );
}
