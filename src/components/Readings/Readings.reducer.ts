import { FilterableState, filterTools, sortString } from "../../utils";

const SHOW_COUNT_DEFAULT = 100;

export type Sort = "progress-date-desc" | "progress-date-asc";

const { updateFilter, clearFilter } = filterTools(sortItems, groupItems);

function sortItems(items: Queries.ReadingsListItemFragment[], sortOrder: Sort) {
  const sortMap: Record<
    Sort,
    (
      a: Queries.ReadingsListItemFragment,
      b: Queries.ReadingsListItemFragment,
    ) => number
  > = {
    "progress-date-desc": (a, b) => sortString(a.sequence, b.sequence) * -1,
    "progress-date-asc": (a, b) => sortString(a.sequence, b.sequence),
  };

  const comparer = sortMap[sortOrder];
  return items.sort(comparer);
}

function groupItems(
  items: Queries.ReadingsListItemFragment[],
): Map<string, Map<string, Queries.ReadingsListItemFragment[]>> {
  const shortMonthToLong: Record<string, string> = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  };

  const groupedItems = new Map<
    string,
    Map<string, Queries.ReadingsListItemFragment[]>
  >();

  items.map((item) => {
    const monthYearGroup = `${shortMonthToLong[item.readingMonth]} ${
      item.readingYear
    }`;

    let groupValue = groupedItems.get(monthYearGroup);

    if (!groupValue) {
      groupValue = new Map<string, Queries.ReadingsListItemFragment[]>();
      groupedItems.set(monthYearGroup, groupValue);
    }

    const dayGroup = `${item.readingDay}-${item.date}`;

    let dayGroupValue = groupValue.get(dayGroup);

    if (!dayGroupValue) {
      dayGroupValue = [];
      groupValue.set(dayGroup, dayGroupValue);
    }

    dayGroupValue.push(item);
  });

  return groupedItems;
}

export type State = FilterableState<
  Queries.ReadingsListItemFragment,
  Sort,
  Map<string, Map<string, Queries.ReadingsListItemFragment[]>>
>;

export function initState({
  items,
  sort,
}: {
  items: Queries.ReadingsListItemFragment[];
  sort: Sort;
}): State {
  return {
    allItems: items,
    filteredItems: items,
    filters: {},
    groupedItems: groupItems(items.slice(0, SHOW_COUNT_DEFAULT)),
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: sort,
  };
}

export enum ActionType {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_KIND = "FILTER_KIND",
  FILTER_EDITION = "FILTER_EDITION",
  FILTER_PUBLISHED_YEAR = "FILTER_PUBLISHED_YEAR",
  FILTER_READING_YEAR = "FILTER_READING_YEAR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

interface FilterTitleAction {
  type: ActionType.FILTER_TITLE;
  value: string;
}

interface FilterKindAction {
  type: ActionType.FILTER_KIND;
  value: string;
}

interface FilterEditionAction {
  type: ActionType.FILTER_EDITION;
  value: string;
}

interface FilterPublishedYearAction {
  type: ActionType.FILTER_PUBLISHED_YEAR;
  values: [string, string];
}

interface FilterReadingYearAction {
  type: ActionType.FILTER_READING_YEAR;
  values: [string, string];
}

interface SortAction {
  type: ActionType.SORT;
  value: Sort;
}

interface ShowMoreAction {
  type: ActionType.SHOW_MORE;
}

export type Action =
  | FilterTitleAction
  | FilterPublishedYearAction
  | FilterReadingYearAction
  | FilterKindAction
  | FilterEditionAction
  | SortAction
  | ShowMoreAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export function reducer(state: State, action: Action): State {
  let groupedItems;
  let filteredItems;

  switch (action.type) {
    case ActionType.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "title", (item) => {
        return regex.test(item.title);
      });
    }
    case ActionType.FILTER_PUBLISHED_YEAR: {
      return updateFilter(state, "publishedYear", (item) => {
        const publishedYear = item.yearPublished;
        return (
          publishedYear >= action.values[0] && publishedYear <= action.values[1]
        );
      });
    }
    case ActionType.FILTER_KIND: {
      return (
        clearFilter(action.value, state, "kind") ??
        updateFilter(state, "kind", (item) => {
          return item.kind === action.value;
        })
      );
    }
    case ActionType.FILTER_EDITION: {
      return (
        clearFilter(action.value, state, "edition") ??
        updateFilter(state, "edition", (item) => {
          return item.edition === action.value;
        })
      );
    }
    case ActionType.FILTER_READING_YEAR: {
      return updateFilter(state, "readingYear", (item) => {
        return (
          item.readingYear >= action.values[0] &&
          item.readingYear <= action.values[1]
        );
      });
    }
    case ActionType.SORT: {
      filteredItems = sortItems(state.filteredItems, action.value);
      groupedItems = groupItems(filteredItems.slice(0, state.showCount));
      return {
        ...state,
        sortValue: action.value,
        filteredItems,
        groupedItems,
      };
    }
    case ActionType.SHOW_MORE: {
      const showCount = state.showCount + SHOW_COUNT_DEFAULT;

      groupedItems = groupItems(state.filteredItems.slice(0, showCount));

      return {
        ...state,
        groupedItems,
        showCount,
      };
    }
    // no default
  }
}
