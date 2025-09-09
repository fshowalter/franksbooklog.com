export {
  createGroupValues,
  createSelectSortedFilteredValues,
  createSortValues,
} from "./sorter";

import { getGroupLetter, sortNumber, sortString } from "./sorter";

/**
 * Available sort options for reviewed works.
 * Includes sorting by grade, review date, title, and work year in both directions.
 */
export type ReviewedWorkSort =
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

/**
 * Interface for reviewed work items that can be sorted.
 * Contains all the fields necessary for sorting and grouping reviewed works.
 */
type SortableReviewedWork = {
  /** Letter grade (e.g., "A+", "B-") */
  grade: string;
  /** Numeric grade value for sorting */
  gradeValue: number;
  /** Review sequence number for chronological sorting */
  reviewSequence: number;
  /** Year the review was written */
  reviewYear: string;
  /** Normalized title for sorting (typically lowercase) */
  sortTitle: string;
  /** Year the work was published */
  workYear: string;
  /** Numeric sequence for work year sorting */
  workYearSequence: number;
};

/**
 * Creates a complete sort map for reviewed works.
 * Combines all individual sort functions into a single mapping object.
 * 
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object mapping sort keys to comparison functions
 */
export function createReviewedWorkSortMap<
  TValue extends SortableReviewedWork,
>() {
  return {
    ...sortGrade<TValue>(),
    ...sortReviewDate<TValue>(),
    ...sortTitle<TValue>(),
    ...sortWorkYear<TValue>(),
  };
}

/**
 * Creates a function to select and group paginated values.
 * Higher-order function that applies pagination before grouping.
 * 
 * @template TValue - The type of values being grouped
 * @template TSort - The type of sort criteria
 * @param groupFn - Function that groups values based on sort criteria
 * @returns Function that applies pagination then grouping
 */
export function createSelectGroupedValues<TValue, TSort>(
  groupFn: (values: TValue[], sort: TSort) => Map<string, TValue[]>,
) {
  return function selectGroupedValues(
    sortedValues: TValue[],
    showCount: number,
    sort: TSort,
  ): Map<string, TValue[]> {
    const paginatedItems = sortedValues.slice(0, showCount);
    return groupFn(paginatedItems, sort);
  };
}

/**
 * Determines the group key for a reviewed work based on sort criteria.
 * Returns appropriate grouping value (grade, year, letter, etc.) based on current sort.
 * 
 * @template TSort - The specific sort type being used
 * @param value - The reviewed work item to group
 * @param sort - The current sort criteria
 * @returns String key for grouping this item
 */
export function groupForSortableReviewedWork<TSort extends ReviewedWorkSort>(
  value: SortableReviewedWork,
  sort: TSort,
): string {
  switch (sort) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
    }
    case "review-date-asc":
    case "review-date-desc": {
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
}

/**
 * Creates grade-based sort functions.
 * 
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with grade sort functions
 */
function sortGrade<TValue extends SortableReviewedWork>() {
  return {
    "grade-asc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue),
    "grade-desc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue) * -1,
  };
}

/**
 * Creates review date-based sort functions.
 * 
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with review date sort functions
 */
function sortReviewDate<TValue extends SortableReviewedWork>() {
  return {
    "review-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence),
    "review-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence) * -1,
  };
}

/**
 * Creates title-based sort functions.
 * 
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with title sort functions
 */
function sortTitle<TValue extends SortableReviewedWork>() {
  return {
    "title-asc": (a: TValue, b: TValue) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a: TValue, b: TValue) =>
      sortString(a.sortTitle, b.sortTitle) * -1,
  };
}

/**
 * Creates work year-based sort functions.
 * 
 * @template TValue - Type extending SortableReviewedWork
 * @returns Object with work year sort functions
 */
function sortWorkYear<TValue extends SortableReviewedWork>() {
  return {
    "work-year-asc": (a: TValue, b: TValue) =>
      sortNumber(a.workYearSequence, b.workYearSequence),
    "work-year-desc": (a: TValue, b: TValue) =>
      sortNumber(a.workYearSequence, b.workYearSequence) * -1,
  };
}
