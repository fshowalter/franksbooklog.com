/**
 * Reviews reducer with pending filters support
 */
import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildGroupValues,
  buildSortValues,
  createInitialState,
  getGroupLetter,
  handleKindFilterAction,
  handleListWithFiltersAction,
  handleReviewYearFilterAction,
  handleTitleFilterAction,
  handleWorkYearFilterAction,
  ListWithFiltersActions,
  sortGrade,
  sortNumber,
  sortReviewDate,
  sortTitle,
  sortWorkYear,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

import type { ReviewsListItemValue } from "./Reviews";

enum ReviewsActions {
  PENDING_FILTER_GRADE = "PENDING_FILTER_GRADE",
}

export type ReviewsSort =
  | "author-asc"
  | "author-desc"
  | "grade-asc"
  | "grade-desc"
  | "review-date-asc"
  | "review-date-desc"
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...ReviewsActions,
} as const;

function groupForValue(
  value: ReviewsListItemValue,
  sortValue: ReviewsSort,
): string {
  switch (sortValue) {
    case "author-asc":
    case "author-desc": {
      return value.authors[0].sortName[0];
    }
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return monthGroupFormat.format(value.date);
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

const groupValues = buildGroupValues(groupForValue);

export type ActionType =
  | ListWithFiltersActionType<ReviewsSort>
  | PendingFilterGradeAction;

// Grade filter is specific to Reviews
type PendingFilterGradeAction = {
  type: ReviewsActions.PENDING_FILTER_GRADE;
  values: [number, number];
};

const sortValues = buildSortValues<ReviewsListItemValue, ReviewsSort>({
  ...sortGrade<ReviewsListItemValue>(),
  ...sortReviewDate<ReviewsListItemValue>(),
  ...sortTitle<ReviewsListItemValue>(),
  ...sortWorkYear<ReviewsListItemValue>(),
  "author-asc": (a, b) => sortNumber(a.authorSequence, b.authorSequence),
  "author-desc": (a, b) => sortNumber(a.authorSequence, b.authorSequence) * -1,
});

const monthGroupFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

type State = ListWithFiltersState<ReviewsListItemValue, ReviewsSort>;

export function initState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsListItemValue[];
}): State {
  return createInitialState({
    groupFn: groupValues,
    initialSort,
    sortFn: sortValues,
    values,
  });
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filters
    case ListWithFiltersActions.PENDING_FILTER_KIND: {
      return handleKindFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_REVIEW_YEAR: {
      return handleReviewYearFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action);
    }

    case ListWithFiltersActions.PENDING_FILTER_WORK_YEAR: {
      return handleWorkYearFilterAction(state, action);
    }

    case ReviewsActions.PENDING_FILTER_GRADE: {
      const typedAction = action;
      const filterFn = (value: ReviewsListItemValue) =>
        value.gradeValue >= typedAction.values[0] &&
        value.gradeValue <= typedAction.values[1];
      return updatePendingFilter(state, "grade", filterFn, typedAction.values);
    }

    default: {
      // Handle shared list structure actions
      return handleListWithFiltersAction(state, action, {
        groupFn: groupValues,
        sortFn: sortValues,
      });
    }
  }
}
