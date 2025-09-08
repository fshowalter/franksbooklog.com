export {
  createGroupValues,
  createSelectSortedFilteredValues,
  createSortValues,
} from "./sorter";

import { getGroupLetter, sortNumber, sortString } from "./sorter";

export type ReviewedWorkSort =
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

type SortableReviewedWork = {
  grade: string;
  gradeValue: number;
  reviewSequence: number;
  reviewYear: string;
  sortTitle: string;
  workYear: string;
  workYearSequence: number;
};

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

function sortGrade<TValue extends SortableReviewedWork>() {
  return {
    "grade-asc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue),
    "grade-desc": (a: TValue, b: TValue) =>
      sortNumber(a.gradeValue, b.gradeValue) * -1,
  };
}

function sortReviewDate<TValue extends SortableReviewedWork>() {
  return {
    "review-date-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence),
    "review-date-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewSequence, b.reviewSequence) * -1,
  };
}

function sortTitle<TValue extends SortableReviewedWork>() {
  return {
    "title-asc": (a: TValue, b: TValue) => sortString(a.sortTitle, b.sortTitle),
    "title-desc": (a: TValue, b: TValue) =>
      sortString(a.sortTitle, b.sortTitle) * -1,
  };
}

function sortWorkYear<TValue extends SortableReviewedWork>() {
  return {
    "work-year-asc": (a: TValue, b: TValue) =>
      sortNumber(a.workYearSequence, b.workYearSequence),
    "work-year-desc": (a: TValue, b: TValue) =>
      sortNumber(a.workYearSequence, b.workYearSequence) * -1,
  };
}
