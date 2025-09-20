import { createSorter, sortNumber, sortString } from "./createSorter";

/**
 * Interface for reviewed work items that can be sorted.
 * Contains all the fields necessary for sorting and grouping reviewed works.
 */
export type SortableTitle = {
  /** Normalized title for sorting (typically lowercase) */
  sortTitle: string;
  /** Year the work was published */
  workYear: string;
  /** Numeric sequence for release year sorting */
  workYearSequence: number;
};

/**
 * Available sort options for titles.
 * Includes sorting by release date and title in both directions.
 */
export type TitleSort =
  | "title-asc"
  | "title-desc"
  | "work-date-asc"
  | "work-date-desc";

/**
 * Creates a title sorter function with default and custom sort options.
 * @param sortMap - Optional additional sort functions
 * @returns Function that sorts titles based on the provided sort parameter
 */
export function createTitleSorter<
  TValue extends SortableTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createSorter<TValue, TSort>({
    ...sortTitle<TValue>(),
    ...sortReleaseDate<TValue>(),
    ...sortMap,
  });

  return function titleSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}

/**
 * Creates release year-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with work year sort functions
 */
function sortReleaseDate<TValue extends SortableTitle>() {
  return {
    "work-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.workYearSequence, b.workYearSequence),
    "work-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.workYearSequence, b.workYearSequence) * -1,
  };
}

/**
 * Creates title-based sort functions.
 *
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with title sort functions
 */
function sortTitle<TValue extends SortableTitle>() {
  return {
    "title-asc": (a: TValue, b: TValue) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a: TValue, b: TValue) =>
      sortString(a.sortTitle, b.sortTitle) * -1,
  };
}
