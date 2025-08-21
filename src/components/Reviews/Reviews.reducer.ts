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

function groupForValue(value: ListItemValue, sortValue: Sort): string {
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
    case "year-published-asc":
    case "year-published-desc": {
      return value.yearPublished;
    }
  }
}

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

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
  "author-asc": (a, b) =>
    sortString(a.authors[0].sortName, b.authors[0].sortName),
  "author-desc": (a, b) =>
    sortString(a.authors[0].sortName, b.authors[0].sortName) * -1,
  "year-published-asc": (a, b) => sortString(a.yearPublished, b.yearPublished),
  "year-published-desc": (a, b) =>
    sortString(a.yearPublished, b.yearPublished) * -1,
});

const monthGroupFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  timeZone: "UTC",
  year: "numeric",
});

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

const SHOW_COUNT_DEFAULT = 100;

export enum Actions {
  FILTER_KIND = "FILTER_KIND",
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_YEAR_PUBLISHED = "FILTER_YEAR_PUBLISHED",
  FILTER_YEAR_REVIEWED = "FILTER_YEAR_REVIEWED",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type ActionType =
  | FilterKindAction
  | FilterTitleAction
  | FilterYearPublishedAction
  | FilterYearReviewedAction
  | ShowMoreAction
  | SortAction;

type FilterKindAction = {
  type: Actions.FILTER_KIND;
  value: string;
};

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type FilterYearPublishedAction = {
  type: Actions.FILTER_YEAR_PUBLISHED;
  values: [string, string];
};

type FilterYearReviewedAction = {
  type: Actions.FILTER_YEAR_REVIEWED;
  values: [string, string];
};

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
