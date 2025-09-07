import type {
  CollectionsActionType,
  CollectionsListState,
  CollectionsSortType,
} from "~/components/ListWithFilters/collectionsReducerUtils";
import type { ListWithFiltersActionType } from "~/components/ListWithFilters/ListWithFilters.reducerUtils";

import {
  CollectionsActions,
  createCollectionGroupForValue,
  handleNameFilterAction,
  sortName,
  sortReviewCount,
} from "~/components/ListWithFilters/collectionsReducerUtils";
import {
  createInitialState,
  handleListWithFiltersAction,
  ListWithFiltersActions,
} from "~/components/ListWithFilters/ListWithFilters.reducerUtils";
import { buildGroupValues, buildSortValues } from "~/utils/reducerUtils";

import type { ListItemValue } from "./Authors";

export const Actions = {
  ...ListWithFiltersActions,
  ...CollectionsActions,
} as const;

export type ActionType =
  | CollectionsActionType<Sort>
  | ListWithFiltersActionType<Sort>;

export type Sort = CollectionsSortType;

type State = CollectionsListState<ListItemValue, Sort>;

const groupForValue = createCollectionGroupForValue<
  ListItemValue,
  CollectionsSortType
>();

const sortValues = buildSortValues<ListItemValue, Sort>({
  ...sortName<ListItemValue>(),
  ...sortReviewCount<ListItemValue>(),
});

const groupValues = buildGroupValues(groupForValue);

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
    showCount: undefined, // CastAndCrew doesn't paginate
    sortFn: sortValues,
    values,
  }) as State;
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    // Field-specific shared filter
    case CollectionsActions.PENDING_FILTER_NAME: {
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
