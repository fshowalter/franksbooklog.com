import type { FilterableState } from "~/utils";

import {
  buildGroupValues,
  collator,
  filterTools,
  sortNumber,
  sortString,
} from "~/utils";
import {
  createInitialState,
  handleFilterKind,
  handleFilterTitle,
  handleFilterYearPublished,
  handleShowMore,
  handleSort,
} from "~/utils/reducerUtils";

import type { ListItemValue } from "./Author";

export type Sort =
  | "grade-asc"
  | "grade-desc"
  | "title-asc"
  | "title-desc"
  | "year-published-asc"
  | "year-published-desc";

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "grade-asc":
    case "grade-desc": {
      return value.grade ?? "Unread";
    }
    case "title-asc":
    case "title-desc": {
      const letter = value.sortTitle.slice(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return value.sortTitle.slice(0, 1).toLocaleUpperCase();
    }
    case "year-published-asc":
    case "year-published-desc": {
      return value.yearPublished;
    }
    // no default
  }
}

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "grade-asc": (a, b) => sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1),
      "grade-desc": (a, b) =>
        sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1) * -1,
      "title-asc": (a, b) => collator.compare(a.sortTitle, b.sortTitle),
      "title-desc": (a, b) => collator.compare(a.sortTitle, b.sortTitle) * -1,
      "year-published-asc": (a, b) =>
        sortString(a.yearPublished, b.yearPublished),
      "year-published-desc": (a, b) =>
        sortString(a.yearPublished, b.yearPublished) * -1,
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}

const SHOW_COUNT_DEFAULT = 100;

export enum Actions {
  FILTER_KIND = "FILTER_KIND",
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_YEAR_PUBLISHED = "FILTER_YEAR_PUBLISHED",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type ActionType =
  | FilterKindAction
  | FilterTitleAction
  | FilterYearPublishedAction
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
    case Actions.FILTER_KIND: {
      return handleFilterKind(state, action.value, clearFilter, updateFilter);
    }
    case Actions.FILTER_TITLE: {
      return handleFilterTitle(state, action.value, clearFilter, updateFilter);
    }
    case Actions.FILTER_YEAR_PUBLISHED: {
      return handleFilterYearPublished(
        state,
        action.values,
        clearFilter,
        updateFilter,
      );
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
