import type { FilterableState } from "~/utils";

import { buildGroupValues, collator, filterTools, sortString } from "~/utils";

import type { ListItemValue } from "./Shelf";

export type Sort =
  | "author-asc"
  | "author-desc"
  | "title-asc"
  | "title-desc"
  | "year-published-asc"
  | "year-published-desc";

const groupValues = buildGroupValues(groupForValue);
const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "author-asc": (a, b) =>
        sortString(a.authors[0].sortName, b.authors[0].sortName),
      "author-desc": (a, b) =>
        sortString(a.authors[0].sortName, b.authors[0].sortName) * -1,
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

function groupForValue(value: ListItemValue, sortValue: Sort): string {
  switch (sortValue) {
    case "author-asc":
    case "author-desc": {
      return value.authors[0].sortName[0];
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

type State = FilterableState<ListItemValue, Sort, Map<string, ListItemValue[]>>;

const SHOW_COUNT_DEFAULT = 100;

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

export enum Actions {
  FILTER_AUTHOR = "FILTER_AUTHOR",
  FILTER_KIND = "FILTER_KIND",
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_YEAR_PUBLISHED = "FILTER_YEAR_PUBLISHED",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type FilterKindAction = {
  type: Actions.FILTER_KIND;
  value: string;
};

type FilterAuthorAction = {
  type: Actions.FILTER_AUTHOR;
  value: string;
};

type FilterYearPublishedAction = {
  type: Actions.FILTER_YEAR_PUBLISHED;
  values: [string, string];
};
type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

export type ActionType =
  | FilterAuthorAction
  | FilterKindAction
  | FilterTitleAction
  | FilterYearPublishedAction
  | ShowMoreAction
  | SortAction;

export function reducer(state: State, action: ActionType): State {
  let filteredValues;
  let groupedValues;

  switch (action.type) {
    case Actions.FILTER_AUTHOR: {
      return (
        clearFilter(action.value, state, "author") ??
        updateFilter(state, "author", (value) => {
          return value.authors.some((author) => {
            return author.name === action.value;
          });
        })
      );
    }
    case Actions.FILTER_KIND: {
      return (
        clearFilter(action.value, state, "kind") ??
        updateFilter(state, "kind", (value) => {
          return value.kind === action.value;
        })
      );
    }
    case Actions.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "title", (value) => {
        return regex.test(value.title);
      });
    }
    case Actions.FILTER_YEAR_PUBLISHED: {
      return updateFilter(state, "yearPublished", (value) => {
        const yearPublished = value.yearPublished;
        return (
          yearPublished >= action.values[0] && yearPublished <= action.values[1]
        );
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
