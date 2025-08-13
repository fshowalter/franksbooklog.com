import type { FilterableState } from "~/utils";

import { buildGroupValues, filterTools, sortNumber, sortString } from "~/utils";
import {
  createInitialState,
  handleFilterName,
  handleSort,
} from "~/utils/reducerUtils";

import type { ListItemValue } from "./Authors";

export enum Actions {
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

export type ActionType = FilterNameAction | SortAction;

type FilterNameAction = {
  type: Actions.FILTER_NAME;
  value: string;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  const initialState = createInitialState(
    values,
    initialSort,
    values.length, // Show all items by default
    groupValues,
  );
  return initialState;
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.FILTER_NAME: {
      const newState = handleFilterName(
        state,
        action.value,
        clearFilter,
        updateFilter,
      );
      // Always show all filtered items
      return {
        ...newState,
        showCount: newState.filteredValues.length,
      };
    }
    case Actions.SORT: {
      const newState = handleSort(state, action.value, sortValues, groupValues);
      // Always show all items after sorting
      return {
        ...newState,
        showCount: newState.filteredValues.length,
      };
    }
    // no default
  }
}

function groupForValue(item: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      const letter = item.sortName.slice(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.sortName.slice(0, 1).toLocaleUpperCase();
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
    }
    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "name-asc": (a, b) => sortString(a.sortName, b.sortName),
      "name-desc": (a, b) => sortString(a.sortName, b.sortName) * -1,
      "review-count-asc": (a, b) =>
        sortNumber(a.reviewedWorkCount, b.reviewedWorkCount),
      "review-count-desc": (a, b) =>
        sortNumber(a.reviewedWorkCount, b.reviewedWorkCount) * -1,
    };

  const comparer = sortMap[sortOrder];

  return values.sort(comparer);
}
