import type { CollectionsFilterActionType } from "~/components/ListWithFilters/collectionsReducerUtils";
import type {
  ListWithFiltersActionType,
  ListWithFiltersState,
} from "~/components/ListWithFilters/reducerUtils";

import {
  CollectionsFilterActions,
  handleNameFilterAction,
  sortName,
  sortReviewCount,
} from "~/components/ListWithFilters/collectionsReducerUtils";
import {
  buildGroupValues,
  buildSortValues,
  createInitialState,
  getGroupLetter,
  handleListWithFiltersAction,
  ListWithFiltersActions,
} from "~/components/ListWithFilters/reducerUtils";

import type { ListItemValue } from "./Authors";

export type ActionType =
  | CollectionsFilterActionType
  | ListWithFiltersActionType<Sort>;

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
    case CollectionsFilterActions.PENDING_FILTER_NAME: {
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

// Re-export shared actions for component convenience
export const Actions = {
  ...ListWithFiltersActions,
  ...CollectionsFilterActions,
} as const;
