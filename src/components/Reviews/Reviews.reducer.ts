/**
 * Reviews reducer with pending filters support
 */
import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/reducerUtils";
import type {
  PaginationState,
  WorksFilterActionType,
} from "~/components/ListWithFilters/worksReducerUtils";

import {
  buildGroupValues,
  buildSortValues,
  getGroupLetter,
  handleListWithFiltersAction,
  ListWithFiltersActions,
  sortNumber,
  updatePendingFilter,
} from "~/components/ListWithFilters/reducerUtils";
import {
  applyPendingFiltersWithPagination,
  createInitialStateWithPagination,
  handleKindFilterAction,
  handleReviewYearFilterAction,
  handleShowMoreAction,
  handleTitleFilterAction,
  handleWorkYearFilterAction,
  sortGrade,
  sortReviewDate,
  sortTitle,
  sortWorkYear,
  updateSortWithPagination,
  WorksFilterActions,
} from "~/components/ListWithFilters/worksReducerUtils";

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
  ...WorksFilterActions,
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
  | PendingFilterGradeAction
  | WorksFilterActionType;

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

type State = ListWithFiltersState<ReviewsListItemValue, ReviewsSort> &
  PaginationState;

export function initState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsListItemValue[];
}): State {
  return createInitialStateWithPagination({
    groupFn: groupValues,
    initialSort,
    showMoreEnabled: true,
    sortFn: sortValues,
    values,
  }) as State;
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case ListWithFiltersActions.APPLY_PENDING_FILTERS: {
      const baseResult = handleListWithFiltersAction(state, action, {
        groupFn: groupValues,
        sortFn: sortValues,
      });
      return applyPendingFiltersWithPagination(state, baseResult, groupValues);
    }

    case ListWithFiltersActions.SORT: {
      const baseResult = handleListWithFiltersAction(state, action, {
        groupFn: groupValues,
        sortFn: sortValues,
      });
      return updateSortWithPagination(state, baseResult, groupValues);
    }

    case ReviewsActions.PENDING_FILTER_GRADE: {
      const typedAction = action;
      const filterFn = (value: ReviewsListItemValue) =>
        value.gradeValue >= typedAction.values[0] &&
        value.gradeValue <= typedAction.values[1];
      return {
        ...state,
        ...updatePendingFilter(state, "grade", filterFn, typedAction.values),
      };
    }

    // Field-specific shared filters
    case WorksFilterActions.PENDING_FILTER_KIND: {
      return handleKindFilterAction(state, action);
    }

    case WorksFilterActions.PENDING_FILTER_REVIEW_YEAR: {
      return handleReviewYearFilterAction(state, action);
    }

    case WorksFilterActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action);
    }

    case WorksFilterActions.PENDING_FILTER_WORK_YEAR: {
      return handleWorkYearFilterAction(state, action);
    }

    case WorksFilterActions.SHOW_MORE: {
      return handleShowMoreAction(state, action, groupValues);
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
