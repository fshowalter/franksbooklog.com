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
  sortReviewDate,
  sortTitle,
  sortWorkYear,
  updatePendingFilter,
} from "~/components/ListWithFilters.reducerUtils";

import type { ListItemValue } from "./Author";

enum AuthorActions {
  PENDING_FILTER_GRADE = "PENDING_FILTER_GRADE",
}

export type Sort =
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
  ...AuthorActions,
} as const;

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade;
    }
    case "review-date-asc":
    case "review-date-desc": {
      return monthGroupFormat.format(value.reviewDate);
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
  | ListWithFiltersActionType<Sort>
  | PendingFilterGradeAction;

// Grade filter is specific to Reviews
type PendingFilterGradeAction = {
  type: AuthorActions.PENDING_FILTER_GRADE;
  values: [number, number];
};

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortGrade<ListItemValue>(),
  ...sortReviewDate<ListItemValue>(),
  ...sortTitle<ListItemValue>(),
  ...sortWorkYear<ListItemValue>(),
});

const monthGroupFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

type State = ListWithFiltersState<ListItemValue, Sort>;

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
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
    case AuthorActions.PENDING_FILTER_GRADE: {
      const typedAction = action;
      const filterFn = (value: ListItemValue) =>
        value.gradeValue >= typedAction.values[0] &&
        value.gradeValue <= typedAction.values[1];
      return updatePendingFilter(state, "grade", filterFn, typedAction.values);
    }

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

    default: {
      // Handle shared list structure actions
      return handleListWithFiltersAction(state, action, {
        groupFn: groupValues,
        sortFn: sortValues,
      });
    }
  }
}
