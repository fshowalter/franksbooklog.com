import { useEffect, useReducer, useRef, useState } from "react";

import type { CoverImageProps } from "~/api/covers";

import { FilterAndSortContainer } from "~/components/FilterAndSort/FilterAndSortContainer";
import { FilterAndSortHeaderLink } from "~/components/FilterAndSort/FilterAndSortHeaderLink";

import { CalendarMonth } from "./CalendarMonth";
import { Filters } from "./Filters";
import { MonthNavHeader } from "./MonthNavHeader";
import {
  createApplyPendingFiltersAction,
  createClearPendingFiltersAction,
  createResetPendingFiltersAction,
  createSortAction,
  initState,
  readingsReducer,
} from "./Readings.reducer";
import { type ReadingsSort, selectWeeksForMonth } from "./Readings.sorter";

export type ReadingsValue = {
  authors: { name: string }[];
  coverImageProps: CoverImageProps;
  edition: string;
  entrySequence: number;
  kind: string;
  progress: string;
  readingDate: string; // Full date string YYYY-MM-DD
  readingDay: string;
  readingMonth: string;
  readingMonthShort: string;
  readingYear: string;
  reviewed: boolean;
  slug: string;
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

  const weeksForMonth = selectWeeksForMonth(
    state.currentMonth,
    state.filteredValues,
  );

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
          dispatch(createSortAction(e.target.value as ReadingsSort)),
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
      <div className="mx-auto w-full max-w-(--breakpoint-desktop)">
        <MonthNavHeader
          currentMonth={state.currentMonth}
          dispatch={dispatch}
          hasNextMonth={state.hasNextMonth}
          hasPrevMonth={state.hasPrevMonth}
          nextMonth={state.nextMonth}
          prevMonth={state.prevMonth}
        />
        <CalendarMonth weeks={weeksForMonth} />
      </div>
    </FilterAndSortContainer>
  );
}
