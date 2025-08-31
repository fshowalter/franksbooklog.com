import { useEffect, useReducer, useRef, useState } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { TimelineEntry } from "~/api/timelineEntries";

import { Abandoned } from "~/components/Abandoned";
import { BarGradient } from "~/components/BarGradient";
import { CoverListItem } from "~/components/CoverList";
import { ListItemAuthors } from "~/components/ListItemAuthors";
import { ListItemTitle } from "~/components/ListItemTitle";
import {
  ListHeaderButton,
  ListWithFilters,
} from "~/components/ListWithFilters/ListWithFilters";

import { Filters } from "./Filters";
import {
  Actions,
  type ActionType,
  initState,
  reducer,
  type Sort,
} from "./Readings.reducer";

export type ListItemValue = Pick<
  TimelineEntry,
  | "authors"
  | "edition"
  | "kind"
  | "progress"
  | "reviewed"
  | "slug"
  | "timelineSequence"
  | "title"
  | "workYear"
> & {
  coverImageProps: CoverImageProps;
  readingDate: string; // Full date string YYYY-MM-DD
  readingDay: string;
  readingMonth: string;
  readingMonthShort: string;
  readingYear: string;
};

export const ReadingsItemImageConfig = {
  height: 375,
  sizes:
    "(min-width: 1800px) 216px, (min-width: 1380px) calc(13.25vw - 20px), (min-width: 1280px) calc(20vw - 70px), (min-width: 1060px) calc(20vw - 57px), (min-width: 800px) calc(25vw - 60px), (min-width: 680px) calc(33vw - 61px), calc(23.06vw + 4px)",
  width: 250,
};

export type Props = {
  distinctEditions: readonly string[];
  distinctKinds: readonly string[];
  distinctReadingYears: readonly string[];
  distinctWorkYears: readonly string[];
  initialSort: Sort;
  values: ListItemValue[];
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
}: Props): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
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
    <ListWithFilters
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
      list={
        <CalendarView
          currentMonth={state.currentMonth}
          dispatch={dispatch}
          groupedValues={state.groupedValues}
          hasNextMonth={state.hasNextMonth}
          hasPrevMonth={state.hasPrevMonth}
          nextMonth={state.nextMonth}
          prevMonth={state.prevMonth}
        />
      }
      listHeaderButtons={
        <ListHeaderButton href="/readings/stats/" text="stats" />
      }
      onApplyFilters={() => dispatch({ type: Actions.APPLY_PENDING_FILTERS })}
      onClearFilters={() => {
        dispatch({ type: Actions.CLEAR_PENDING_FILTERS });
        setFilterKey((prev) => prev + 1);
      }}
      onFilterDrawerOpen={() => {
        // Increment key to force remount of filter components
        setFilterKey((prev) => prev + 1);
        dispatch({ type: Actions.RESET_PENDING_FILTERS });
      }}
      onResetFilters={() => dispatch({ type: Actions.RESET_PENDING_FILTERS })}
      pendingFilteredCount={state.pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sortValue,
        onSortChange: (e) =>
          dispatch({
            type: Actions.SORT,
            value: e.target.value as Sort,
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
    />
  );
}

function CalendarDay({ day }: { day: CalendarDayData }): React.JSX.Element {
  if (!day.date) {
    return (
      <td
        className={`
          hidden min-h-[100px] border border-default bg-transparent p-2
          align-top
          tablet-landscape:table-cell
        `}
      />
    );
  }

  const weekday = day.weekday!; // Always defined for days with dates

  return (
    <td
      className={`
        min-h-[100px] w-full border-default bg-calendar align-top
        tablet:border tablet:px-2
        tablet-landscape:mb-0 tablet-landscape:table-cell
        tablet-landscape:w-[14.28%] tablet-landscape:py-2
        ${day.readings.length === 0 ? `hidden` : `block`}
      `}
      data-weekday={weekday}
    >
      <div
        className={`
          mb-1 px-container py-2 text-sm font-medium
          tablet:px-6 tablet:text-xl tablet:font-normal
          tablet-landscape:py-0
          ${day.readings.length > 0 ? "text-default" : "text-muted"}
        `}
      >
        <span
          className={`
            mr-2 font-sans text-xs font-light text-subtle uppercase
            tablet-landscape:hidden
          `}
        >
          {weekday}
        </span>
        {day.date}
      </div>
      {day.readings.length > 0 && (
        <div className="@container/cover-list">
          <ol
            className={`
              flex flex-col
              [--cover-list-item-width:33.33%]
              tablet:flex-row tablet:flex-wrap tablet:items-baseline
              tablet-landscape:flex-col
              tablet-landscape:[--cover-list-item-width:100%]
              @min-[calc((250px_*_3)_+_1px)]/cover-list:[--cover-list-item-width:25%]
            `}
          >
            {day.readings.map((reading) => (
              <CoverListItem
                className={`items-center`}
                coverImageProps={reading.coverImageProps}
                key={reading.timelineSequence}
              >
                <div
                  className={`
                    flex grow flex-col items-start gap-y-2
                    tablet:mt-2 tablet:w-full tablet:gap-y-1 tablet:px-1
                  `}
                >
                  <ListItemTitle
                    slug={reading.reviewed ? reading.slug : undefined}
                    title={reading.title}
                  />
                  <ListItemAuthors values={reading.authors} />
                  <div
                    className={`
                      font-sans text-xs leading-4 font-normal tracking-prose
                      text-subtle
                    `}
                  >
                    {reading.edition}
                  </div>
                  {reading.progress === "Abandoned" ? (
                    <Abandoned className="mt-1" value={reading.progress} />
                  ) : (
                    <div
                      className={`
                        grid grid-cols-[1fr_auto] items-center self-stretch
                      `}
                    >
                      <div className="flex h-[6px] flex-col bg-subtle">
                        <BarGradient
                          maxValue={100}
                          value={parseProgress(reading.progress)}
                        />
                      </div>
                      <span className="pl-4 font-sans text-xs text-subtle">
                        {reading.progress}
                      </span>
                    </div>
                  )}
                </div>
              </CoverListItem>
            ))}
          </ol>
        </div>
      )}
    </td>
  );
}

function CalendarHeader({
  currentMonth,
  dispatch,
  hasNextMonth,
  hasPrevMonth,
  nextMonth,
  prevMonth,
}: CalendarHeaderProps): React.JSX.Element {
  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });

  const prevMonthName = prevMonth
    ? prevMonth.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  const nextMonthName = nextMonth
    ? nextMonth.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={`
        sticky top-(--list-scroll-offset) z-sticky flex
        max-w-(--breakpoint-desktop) items-center justify-between border-b
        border-default bg-subtle px-container py-4
        tablet:-mx-(--container-padding) tablet:py-6
        tablet-landscape:py-8
        desktop:-mx-0 desktop:px-0
      `}
    >
      <div className="w-1/3">
        {hasPrevMonth && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to previous month: ${prevMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-[13px]
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-right after:scale-x-0 after:bg-(--fg-accent)
              after:transition-transform after:duration-500
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() => dispatch({ type: Actions.PREV_MONTH })}
            type="button"
          >
            ← {prevMonthName}
          </button>
        )}
      </div>
      <h2
        className={`
          w-1/3 text-center text-base font-medium
          tablet:text-lg
          tablet-landscape:text-xl
        `}
      >
        {monthName}
      </h2>
      <div className="w-1/3 text-right">
        {hasNextMonth && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to next month: ${nextMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-[13px]
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-left after:scale-x-0 after:bg-(--fg-accent)
              after:transition-transform after:duration-500
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() => dispatch({ type: Actions.NEXT_MONTH })}
            type="button"
          >
            {nextMonthName} →
          </button>
        )}
      </div>
    </div>
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
      <CalendarHeader
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
