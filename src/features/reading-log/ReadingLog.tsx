import { useEffect, useReducer, useRef } from "react";

import type { CoverImageProps } from "~/api/covers";

import { FilterAndSortContainer } from "~/components/filter-and-sort/FilterAndSortContainer";
import { createReviewedStatusCountMap } from "~/filterers/createReviewedStatusFilter";
import { useFilteredValues } from "~/hooks/useFilteredValues";
import { usePendingFilterCount } from "~/hooks/usePendingFilterCount";

import type { ReadingLogSort } from "./sortReadingLog";

import { buildAppliedFilterChips } from "./buildAppliedFilterChips";
import { CalendarMonth } from "./CalendarMonth";
import { filterReadingLog } from "./filterReadingLog";
import { MonthNavigationHeader } from "./MonthNavigationHeader";
import {
  createApplyFiltersAction,
  createClearFiltersAction,
  createInitialState,
  createRemoveAppliedFilterAction,
  createResetFiltersAction,
  createSortAction,
  reducer,
  selectHasPendingFilters,
} from "./ReadingLog.reducer";
import { Filters } from "./ReadingLogFilters";
import { sortReadingLog } from "./sortReadingLog";
import { useMonthNavigation } from "./useMonthNavigation";

/**
 * Data structure representing a single reading entry.
 * Contains all information needed to display readings in the calendar view.
 */
export type ReadingLogValue = {
  /** Whether this reading was abandoned (progress === "Abandoned") */
  abandoned: boolean;
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
export const ReadingLogImageConfig = {
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
export type ReadingLogProps = {
  /** Available editions for filter dropdown options */
  distinctEditions: readonly string[];
  /** Available work kinds for filter dropdown options */
  distinctKinds: readonly string[];
  /** Available reading years for filter dropdown options */
  distinctReadingYears: readonly string[];
  /** Available work years for filter dropdown options */
  distinctWorkYears: readonly string[];
  /** Initial sort order to apply when page loads */
  initialSort: ReadingLogSort;
  /** Array of reading data for display and filtering */
  values: ReadingLogValue[];
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
export function ReadingLog({
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  initialSort,
  values,
}: ReadingLogProps): React.JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    createInitialState,
  );
  const prevMonthRef = useRef(state.selectedMonthDate);

  // Scroll to top of calendar when month changes
  useEffect(() => {
    if (prevMonthRef.current !== state.selectedMonthDate) {
      prevMonthRef.current = state.selectedMonthDate;
      if (typeof document !== "undefined") {
        document
          .querySelector("#calendar")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [state.selectedMonthDate]);

  const filteredValues = useFilteredValues(
    sortReadingLog,
    filterReadingLog,
    state.values,
    state.sort,
    state.activeFilterValues,
  );

  const pendingFilteredCount = usePendingFilterCount(
    filterReadingLog,
    state.values,
    state.pendingFilterValues,
  );

  const reviewedStatusCounts = createReviewedStatusCountMap(state.values);

  const hasPendingFilters = selectHasPendingFilters(state);
  const activeFilters = buildAppliedFilterChips(
    state.activeFilterValues,
    distinctWorkYears,
    distinctReadingYears,
  );

  const [previousMonthDate, currentMonthDate, nextMonthDate] =
    useMonthNavigation(filteredValues, state.sort, state.selectedMonthDate);

  return (
    <FilterAndSortContainer
      activeFilters={activeFilters}
      filters={
        <Filters
          dispatch={dispatch}
          distinctEditions={distinctEditions}
          distinctKinds={distinctKinds}
          distinctReadingYears={distinctReadingYears}
          distinctWorkYears={distinctWorkYears}
          filterValues={state.pendingFilterValues}
          reviewedStatusCounts={reviewedStatusCounts}
        />
      }
      hasPendingFilters={hasPendingFilters}
      headerLink={{ href: "/readings/stats/", text: "stats" }}
      onApplyFilters={() => dispatch(createApplyFiltersAction())}
      onClearFilters={() => {
        dispatch(createClearFiltersAction());
        dispatch(createApplyFiltersAction());
      }}
      onFilterDrawerOpen={() => {
        dispatch(createResetFiltersAction());
      }}
      onRemoveFilter={(id) => dispatch(createRemoveAppliedFilterAction(id))}
      onResetFilters={() => dispatch(createResetFiltersAction())}
      pendingFilteredCount={pendingFilteredCount}
      sortProps={{
        currentSortValue: state.sort,
        onSortChange: (value) => dispatch(createSortAction(value)),
        sortOptions: [
          { label: "Reading Date (Newest First)", value: "reading-date-desc" },
          { label: "Reading Date (Oldest First)", value: "reading-date-asc" },
        ],
      }}
      totalCount={filteredValues.length}
    >
      {currentMonthDate ? (
        <div className={`mx-auto w-full max-w-(--breakpoint-desktop)`}>
          <MonthNavigationHeader
            currentMonthDate={currentMonthDate}
            dispatch={dispatch}
            nextMonthDate={nextMonthDate}
            prevMonthDate={previousMonthDate}
          />
          <CalendarMonth
            currentMonthDate={currentMonthDate}
            filteredValues={filteredValues}
            sort={state.sort}
          />
        </div>
      ) : (
        <div className="pt-10">No results.</div>
      )}
    </FilterAndSortContainer>
  );
}
