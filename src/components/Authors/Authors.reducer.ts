import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters.reducerUtils";

import {
  buildGroupValues,
  buildSortValues,
  createInitialState,
  getGroupLetter,
  handleListWithFiltersAction,
  handleNameFilterAction,
  ListWithFiltersActions,
  sortName,
  sortReviewCount,
} from "~/components/ListWithFilters.reducerUtils";

import type { ListItemValue } from "./Authors";

export type ActionType = ListWithFiltersActionType<Sort>;

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

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
    showMoreEnabled: false,
    sortFn: sortValues,
    values,
  });
}

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortName<ListItemValue>(),
  ...sortReviewCount<ListItemValue>(),
});

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filter
    case ListWithFiltersActions.PENDING_FILTER_NAME: {
      return handleNameFilterAction(state, action);
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

const groupValues = buildGroupValues(groupForValue);

// Helper functions
function groupForValue(item: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      return getGroupLetter(item.sortName);
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
    }
    // no default
  }
}

export { ListWithFiltersActions as Actions } from "~/components/ListWithFilters.reducerUtils";
