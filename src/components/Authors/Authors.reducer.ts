import type { FilterableState } from "~/utils";

import { buildGroupValues, filterTools, sortNumber, sortString } from "~/utils";
import {
  createInitialState,
  handleFilterName,
  handleShowMore,
  handleSort,
} from "~/utils/reducerUtils";

import type { ListItemValue } from "./Authors";

export enum Actions {
  FILTER_NAME = "FILTER_NAME",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

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

const SHOW_COUNT_DEFAULT = 100;

export type ActionType = FilterNameAction | ShowMoreAction | SortAction;

type FilterNameAction = {
  type: Actions.FILTER_NAME;
  value: string;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

export function initState({
  initialSort,
  values,
}: {
  initialSort: Sort;
  values: ListItemValue[];
}): State {
  return createInitialState(
    values,
    initialSort,
    SHOW_COUNT_DEFAULT,
    groupValues,
  );
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.FILTER_NAME: {
      return handleFilterName(state, action.value, clearFilter, updateFilter);
    }
    case Actions.SHOW_MORE: {
      return handleShowMore(state, SHOW_COUNT_DEFAULT, groupValues);
    }
    case Actions.SORT: {
      return handleSort(state, action.value, sortValues, groupValues);
    }
    // no default
  }
}
