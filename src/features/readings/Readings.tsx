import { useEffect, useReducer, useRef, useState } from "react";

import type { CoverImageProps } from "~/api/covers";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { FilterAndSortHeaderLink } from "~/components/filter-and-sort/FilterAndSortHeaderLink";

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

/**
 * Data structure representing a single reading entry.
 * Contains all information needed to display readings in the calendar view.
 */
export type ReadingsValue = {
  /** Authors of the work being read */
  authors: { name: string }[];
  /** Cover image props for displaying the work's cover */
  coverImageProps: CoverImageProps;
  /** Edition information (e.g., "First Edition", "Paperback") */
  edition: string;
  /** Sequence number for this reading entry */
  entrySequence: number;
  /** Type/category of the work (e.g., "Novel", "Collection") */
  kind: string;
  /** Reading progress (e.g., "Finished", "In Progress") */
  progress: string;
  /** Full date string in YYYY-MM-DD format */
  readingDate: string;
  /** Day portion of the reading date */
  readingDay: string;
  /** Month portion of the reading date */
  readingMonth: string;
  /** Abbreviated month name */
  readingMonthShort: string;
  /** Year portion of the reading date */
  readingYear: string;
  /** Whether this work has been reviewed */
  reviewed: boolean;
  /** URL slug for the work's page */
  slug: string;
  /** Title of the work */
  title: string;
  /** Year the work was originally published */
  workYear: string;
};

/**
 * Configuration for reading item cover images.
 * Defines dimensions and responsive sizes for covers in the calendar view.
 */
export const ReadingsItemImageConfig = {
  /** Cover image height in pixels */
  height: 375,
  /** Responsive sizes string for different viewport widths */
  sizes:
    "(min-width: 1800px) 216px, (min-width: 1380px) calc(13.25vw - 20px), (min-width: 1280px) calc(20vw - 70px), (min-width: 1060px) calc(20vw - 57px), (min-width: 800px) calc(25vw - 60px), (min-width: 680px) calc(33vw - 61px), calc(23.06vw + 4px)",
  /** Cover image width in pixels */
  width: 250,
};

/**
 * Props interface for the Readings page component.
 * Contains all data needed to render the reading calendar with filtering.
 */
export type ReadingsProps = {
  /** Available editions for filter dropdown options */
  distinctEditions: readonly string[];
  /** Available work kinds for filter dropdown options */
  distinctKinds: readonly string[];
  /** Available reading years for filter dropdown options */
  distinctReadingYears: readonly string[];
  /** Available work years for filter dropdown options */
  distinctWorkYears: readonly string[];
  /** Initial sort order to apply when page loads */
  initialSort: ReadingsSort;
  /** Array of reading data for display and filtering */
  values: ReadingsValue[];
};

/**
 * Readings page component displaying a calendar view of reading history.
 * Features month-by-month calendar layout, filtering by various criteria, and navigation.
 * Uses reducer pattern for complex state management including current month selection.
 *
 * @param props - Component props
 * @param props.distinctEditions - Available editions for filtering
 * @param props.distinctKinds - Available work kinds for filtering
 * @param props.distinctReadingYears - Available reading years for filtering
 * @param props.distinctWorkYears - Available work years for filtering
 * @param props.initialSort - Initial sort order for the readings
 * @param props.values - Array of reading data to display
 * @returns Readings page component with calendar view
 */
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
