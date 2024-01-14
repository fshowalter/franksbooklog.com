import {
  FilterableState,
  buildGroupItems,
  collator,
  filterTools,
  sortNumber,
  sortString,
} from "../../utils";

export type Sort =
  | "year-published-desc"
  | "year-published-asc"
  | "title-asc"
  | "title-desc"
  | "grade-asc"
  | "grade-desc";

const groupItems = buildGroupItems(groupForItem);
const { updateFilter, clearFilter, applyFilters } = filterTools(
  sortItems,
  groupItems,
);

function sortItems(items: Queries.AuthorListItemFragment[], sortOrder: Sort) {
  const sortMap: Record<
    Sort,
    (
      a: Queries.AuthorListItemFragment,
      b: Queries.AuthorListItemFragment,
    ) => number
  > = {
    "year-published-desc": (a, b) =>
      sortString(a.yearPublished, b.yearPublished) * -1,
    "year-published-asc": (a, b) =>
      sortString(a.yearPublished, b.yearPublished),
    "title-asc": (a, b) => collator.compare(a.sortTitle, b.sortTitle),
    "title-desc": (a, b) => collator.compare(a.sortTitle, b.sortTitle) * -1,
    "grade-asc": (a, b) => sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1),
    "grade-desc": (a, b) =>
      sortNumber(a.gradeValue ?? -1, b.gradeValue ?? -1) * -1,
  };

  const comparer = sortMap[sortOrder];
  return items.sort(comparer);
}

function groupForItem(
  item: Queries.AuthorListItemFragment,
  sortValue: Sort,
): string {
  switch (sortValue) {
    case "year-published-asc":
    case "year-published-desc": {
      return item.yearPublished.toString();
    }
    case "grade-asc":
    case "grade-desc": {
      return item.grade ?? "Unread";
    }
    case "title-asc":
    case "title-desc": {
      const letter = item.sortTitle.substring(0, 1);

      if (letter.toLowerCase() == letter.toUpperCase()) {
        return "#";
      }

      return item.sortTitle.substring(0, 1).toLocaleUpperCase();
    }
    // no default
  }
}

export interface State
  extends FilterableState<
    Queries.AuthorListItemFragment,
    Sort,
    Map<string, Queries.AuthorListItemFragment[]>
  > {
  hideReviewed: boolean;
}

const SHOW_COUNT_DEFAULT = 100;

export function initState({
  items,
  sort,
}: {
  items: Queries.AuthorListItemFragment[];
  sort: Sort;
}): State {
  return {
    allItems: items,
    filteredItems: items,
    groupedItems: groupItems(items.slice(0, SHOW_COUNT_DEFAULT), sort),
    filters: {},
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: sort,
    hideReviewed: false,
  };
}

export enum ActionType {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_KIND = "FILTER_KIND",
  FILTER_YEAR_PUBLISHED = "FILTER_YEAR_PUBLISHED",
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
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

interface ToggleReviewedAction {
  type: ActionType.TOGGLE_REVIEWED;
}

interface FilterYearPublishedAction {
  type: ActionType.FILTER_YEAR_PUBLISHED;
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
  | ToggleReviewedAction
  | FilterYearPublishedAction
  | FilterKindAction
  | SortAction
  | ShowMoreAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export function reducer(state: State, action: Action): State {
  let filters;
  let filteredItems;
  let groupedItems;

  switch (action.type) {
    case ActionType.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      return updateFilter(state, "title", (item) => {
        return regex.test(item.title);
      });
    }
    case ActionType.FILTER_KIND: {
      return (
        clearFilter(action.value, state, "kind") ??
        updateFilter(state, "medium", (item) => {
          return item.kind === action.value;
        })
      );
    }
    case ActionType.FILTER_YEAR_PUBLISHED: {
      return updateFilter(state, "yearPublished", (item) => {
        const yearPublished = item.yearPublished;
        return (
          yearPublished >= action.values[0] && yearPublished <= action.values[1]
        );
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
    case ActionType.TOGGLE_REVIEWED: {
      if (state.hideReviewed) {
        filters = {
          ...state.filters,
        };
        delete filters.reviewed;
      } else {
        filters = {
          ...state.filters,
          reviewed: (item: Queries.AuthorListItemFragment) => {
            return item.reviewed;
          },
        };
      }
      return {
        ...applyFilters(filters, state),
        hideReviewed: !state.hideReviewed,
      };
    }
    // no default
  }
}
