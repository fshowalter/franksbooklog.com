/**
 * Author page reducer with pending filters support
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
} from "~/components/utils/reducerUtils";

import type { ListItemValue } from "./Author";

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...WorksActions,
} as const;

// Re-export sort type for convenience
export type Sort = WorkSortType;

// Create the groupForValue function using the generic builder
const groupForValue = createWorkGroupForValue<ListItemValue, Sort>();

export type ActionType = ListWithFiltersActionType<Sort> | WorksActionType;

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortGrade<ListItemValue>(),
  ...sortReviewDate<ListItemValue>(),
  ...sortTitle<ListItemValue>(),
  ...sortWorkYear<ListItemValue>(),
});

type State = WorksListState<ListItemValue, Sort> & {
  showCount: number;
};

const groupValues = buildGroupValues(groupForValue);

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const showCount = SHOW_COUNT_DEFAULT;
  const baseState = createInitialState({
    extendedState: {
      showCount,
    },
    groupFn: groupValues,
    initialSort,
    showCount,
    sortFn: sortValues,
    values,
  });

  return baseState;
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
