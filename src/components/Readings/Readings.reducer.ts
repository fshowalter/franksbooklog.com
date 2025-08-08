import type { FilterableState } from "~/utils";

import { filterTools, sortString } from "~/utils";
import {
  handleFilterEdition,
  handleFilterKind,
  handleFilterReadingYear,
  handleFilterTitle,
  handleFilterYearPublished,
} from "~/utils/reducerUtils";

import type { ListItemValue } from "./Readings";

const SHOW_COUNT_DEFAULT = 100;

export type Sort = "progress-date-asc" | "progress-date-desc";

const { clearFilter, updateFilter } = filterTools(sortValues, groupValues);

export enum Actions {
  FILTER_EDITION = "FILTER_EDITION",
  FILTER_KIND = "FILTER_KIND",
  FILTER_PUBLISHED_YEAR = "FILTER_PUBLISHED_YEAR",
  FILTER_READING_YEAR = "FILTER_READING_YEAR",
  FILTER_TITLE = "FILTER_TITLE",
  SHOW_MORE = "SHOW_MORE",
  SORT = "SORT",
}

export type ActionType =
  | FilterEditionAction
  | FilterKindAction
  | FilterPublishedYearAction
  | FilterReadingYearAction
  | FilterTitleAction
  | ShowMoreAction
  | SortAction;

type FilterEditionAction = {
  type: Actions.FILTER_EDITION;
  value: string;
};

type FilterKindAction = {
  type: Actions.FILTER_KIND;
  value: string;
};

type FilterPublishedYearAction = {
  type: Actions.FILTER_PUBLISHED_YEAR;
  values: [string, string];
};

type FilterReadingYearAction = {
  type: Actions.FILTER_READING_YEAR;
  values: [string, string];
};

type FilterTitleAction = {
  type: Actions.FILTER_TITLE;
  value: string;
};

type ShowMoreAction = {
  type: Actions.SHOW_MORE;
};

type SortAction = {
  type: Actions.SORT;
  value: Sort;
};

type State = FilterableState<
  ListItemValue,
  Sort,
  Map<string, Map<string, ListItemValue[]>>
>;

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
    groupedValues: groupValues(values.slice(0, SHOW_COUNT_DEFAULT)),
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: initialSort,
  };
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case Actions.FILTER_EDITION: {
      return handleFilterEdition(
        state,
        action.value,
        clearFilter,
        updateFilter,
      );
    }
    case Actions.FILTER_KIND: {
      return handleFilterKind(state, action.value, clearFilter, updateFilter);
    }
    case Actions.FILTER_PUBLISHED_YEAR: {
      return handleFilterYearPublished(
        state,
        action.values,
        clearFilter,
        updateFilter,
      );
    }
    case Actions.FILTER_READING_YEAR: {
      return handleFilterReadingYear(
        state,
        action.values,
        clearFilter,
        updateFilter,
      );
    }
    case Actions.FILTER_TITLE: {
      return handleFilterTitle(state, action.value, clearFilter, updateFilter);
    }
    case Actions.SHOW_MORE: {
      const showCount = state.showCount + SHOW_COUNT_DEFAULT;
      return {
        ...state,
        groupedValues: groupValues(state.filteredValues.slice(0, showCount)),
        showCount,
      };
    }
    case Actions.SORT: {
      const filteredValues = sortValues(state.filteredValues, action.value);
      return {
        ...state,
        filteredValues,
        groupedValues: groupValues(filteredValues.slice(0, state.showCount)),
        sortValue: action.value,
      };
    }
    // no default
  }
}

function groupValues(
  values: ListItemValue[],
): Map<string, Map<string, ListItemValue[]>> {
  const groupedValues = new Map<string, Map<string, ListItemValue[]>>();

  values.map((value) => {
    const monthYearGroup = `${value.readingMonth} ${value.readingYear}`;

    let groupValue = groupedValues.get(monthYearGroup);

    if (!groupValue) {
      groupValue = new Map<string, ListItemValue[]>();
      groupedValues.set(monthYearGroup, groupValue);
    }

    const dayGroup = `${value.readingDay}-${value.readingDate}`;

    let dayGroupValue = groupValue.get(dayGroup);

    if (!dayGroupValue) {
      dayGroupValue = [];
      groupValue.set(dayGroup, dayGroupValue);
    }

    dayGroupValue.push(value);
  });

  return groupedValues;
}

function sortValues(values: ListItemValue[], sortOrder: Sort) {
  const sortMap: Record<Sort, (a: ListItemValue, b: ListItemValue) => number> =
    {
      "progress-date-asc": (a, b) =>
        sortString(a.timelineSequence, b.timelineSequence),
      "progress-date-desc": (a, b) =>
        sortString(a.timelineSequence, b.timelineSequence) * -1,
    };

  const comparer = sortMap[sortOrder];
  return values.sort(comparer);
}
