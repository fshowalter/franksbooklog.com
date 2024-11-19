import type { FilterableState } from "~/utils";

import { buildGroupValues, filterTools, sortNumber, sortString } from "~/utils";

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
  | "review-count-desc"
  | "work-count-asc"
  | "work-count-desc";

const groupValues = buildGroupValues(groupForValue);
const { updateFilter } = filterTools(sortValues, groupValues);

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
    case "work-count-asc":
    case "work-count-desc": {
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
      "work-count-asc": (a, b) => sortNumber(a.workCount, b.workCount),
      "work-count-desc": (a, b) => sortNumber(a.workCount, b.workCount) * -1,
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
  return {
    allValues: values,
    filteredValues: values,
    filters: {},
    groupedValues: groupValues(
      values.slice(0, SHOW_COUNT_DEFAULT),
      initialSort,
    ),
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
  };
}

export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;

  switch (action.type) {
    case Actions.FILTER_NAME: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "name", (value) => {
        return regex.test(value.name);
      });
    }
    case Actions.SHOW_MORE: {
      const showCount = state.showCount + SHOW_COUNT_DEFAULT;

      groupedValues = groupValues(
        state.filteredValues.slice(0, showCount),
        state.sortValue,
      );

      return {
        ...state,
        groupedValues,
        showCount,
      };
    }
    case Actions.SORT: {
      filteredValues = sortValues(state.filteredValues, action.value);
      groupedValues = groupValues(
        filteredValues.slice(0, state.showCount),
        action.value,
      );
      return {
        ...state,
        filteredValues,
        groupedValues,
        sortValue: action.value,
      };
    }
    // no default
  }
}
