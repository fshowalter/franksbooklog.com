import {
  FilterableState,
  buildGroupItems,
  filterTools,
  sortNumber,
  sortString,
} from "../../utils";

export enum ActionType {
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

export type Sort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc"
  | "work-count-asc"
  | "work-count-desc";

const groupItems = buildGroupItems(groupForItem);
const { updateFilter } = filterTools(sortItems, groupItems);

function sortItems(
  authors: Queries.AuthorsListItemFragment[],
  sortOrder: Sort,
) {
  const sortMap: Record<
    Sort,
    (
      a: Queries.AuthorsListItemFragment,
      b: Queries.AuthorsListItemFragment,
    ) => number
  > = {
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

  return authors.sort(comparer);
}

function groupForItem(
  item: Queries.AuthorsListItemFragment,
  sortValue: Sort,
): string {
  switch (sortValue) {
    case "name-asc":
    case "name-desc": {
      const letter = item.sortName.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.sortName.substring(0, 1).toLocaleUpperCase();
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

export type State = FilterableState<
  Queries.AuthorsListItemFragment,
  Sort,
  Map<string, Queries.AuthorsListItemFragment[]>
>;

const SHOW_COUNT_DEFAULT = 100;

export function initState({
  items,
  sort,
}: {
  items: Queries.AuthorsListItemFragment[];
  sort: Sort;
}): State {
  return {
    allItems: items,
    filteredItems: items,
    groupedItems: groupItems(items.slice(0, SHOW_COUNT_DEFAULT), sort),
    filters: {},
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: sort,
  };
}

interface FilterNameAction {
  type: ActionType.FILTER_NAME;
  value: string;
}

interface SortAction {
  type: ActionType.SORT;
  value: Sort;
}

interface ShowMoreAction {
  type: ActionType.SHOW_MORE;
}

export type Action = FilterNameAction | SortAction | ShowMoreAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export function reducer(state: State, action: Action): State {
  let filteredItems;
  let groupedItems;

  switch (action.type) {
    case ActionType.FILTER_NAME: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "name", (item) => {
        return regex.test(item.name);
      });
    }
    case ActionType.SORT: {
      filteredItems = sortItems(state.filteredItems, action.value);
      groupedItems = groupItems(
        filteredItems.slice(0, state.showCount),
        action.value,
      );
      return {
        ...state,
        sortValue: action.value,
        filteredItems,
        groupedItems,
      };
    }
    case ActionType.SHOW_MORE: {
      const showCount = state.showCount + SHOW_COUNT_DEFAULT;

      groupedItems = groupItems(
        state.filteredItems.slice(0, showCount),
        state.sortValue,
      );

      return {
        ...state,
        groupedItems,
        showCount,
      };
    }
    // no default
  }
}
