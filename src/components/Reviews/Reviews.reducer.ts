/**
 * Reviews reducer with pending filters support
 */
import type { ListWithFiltersActionType } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import type {
  WorksActionType,
  WorksListState,
  WorkSortType,
} from "~/components/ListWithFilters/worksReducerUtils";

import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import {
  createPaginatedGroupFn,
  createWorkGroupForValue,
  handleGradeFilterAction,
  handleKindFilterAction,
  handleReviewYearFilterAction,
  handleShowMoreAction,
  handleTitleFilterAction,
  handleWorkYearFilterAction,
  SHOW_COUNT_DEFAULT,
  sortGrade,
  sortReviewDate,
  sortTitle,
  sortWorkYear,
  WorksActions,
} from "~/components/ListWithFilters/worksReducerUtils";
import {
  buildGroupValues,
  buildSortValues,
  sortNumber,
} from "~/components/utils/reducerUtils";

import type { ReviewsListItemValue } from "./Reviews";

export type ReviewsSort = "author-asc" | "author-desc" | WorkSortType;

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...WorksActions,
} as const;

type State = WorksListState<ReviewsListItemValue, ReviewsSort> & {
  showCount: number;
};

// Create the groupForValue function using the generic builder
const baseGroupForValue = createWorkGroupForValue<
  ReviewsListItemValue,
  WorkSortType
>();

function groupForValue(
  value: ReviewsListItemValue,
  sortValue: ReviewsSort,
): string {
  switch (sortValue) {
    case "author-asc":
    case "author-desc": {
      return value.authors[0].sortName[0];
    }
    default: {
      return baseGroupForValue(value, sortValue);
    }
  }
}

const groupValues = buildGroupValues(groupForValue);

export type ActionType =
  | ListWithFiltersActionType<ReviewsSort>
  | WorksActionType;

const sortValues = buildSortValues<ReviewsListItemValue, ReviewsSort>({
  ...sortGrade<ReviewsListItemValue>(),
  ...sortReviewDate<ReviewsListItemValue>(),
  ...sortTitle<ReviewsListItemValue>(),
  ...sortWorkYear<ReviewsListItemValue>(),
  "author-asc": (a, b) => sortNumber(a.authorSequence, b.authorSequence),
  "author-desc": (a, b) => sortNumber(a.authorSequence, b.authorSequence) * -1,
});

export function initState({
  initialSort,
  values,
}: {
  initialSort: ReviewsSort;
  values: ReviewsListItemValue[];
}): State {
  const showCount = SHOW_COUNT_DEFAULT;
  return createInitialState({
    extendedState: {
      showCount,
    },
    groupFn: groupValues,
    initialSort,
    showCount,
    sortFn: sortValues,
    values,
  }) as State;
}

// Create reducer function
export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case WorksActions.PENDING_FILTER_GRADE: {
      return handleGradeFilterAction(state, action);
    }

    // Field-specific shared filters
    case WorksActions.PENDING_FILTER_KIND: {
      return handleKindFilterAction(state, action);
    }

    case WorksActions.PENDING_FILTER_REVIEW_YEAR: {
      return handleReviewYearFilterAction(state, action);
    }

    case WorksActions.PENDING_FILTER_TITLE: {
      return handleTitleFilterAction(state, action);
    }

    case WorksActions.PENDING_FILTER_WORK_YEAR: {
      return handleWorkYearFilterAction(state, action);
    }

    case WorksActions.SHOW_MORE: {
      return handleShowMoreAction(state, action, groupValues);
    }

    default: {
      // Handle shared list structure actions
      const paginatedGroupFn = createPaginatedGroupFn(
        groupValues,
        state.showCount,
      );
      return handleListWithFiltersAction(
        state,
        action,
        {
          groupFn: paginatedGroupFn,
          sortFn: sortValues,
        },
        { showCount: state.showCount },
      );
    }
  }
}
