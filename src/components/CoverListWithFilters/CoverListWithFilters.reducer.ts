import {
  applyFilters,
  collator,
  sortNumberAsc,
  sortNumberDesc,
  sortStringAsc,
  sortStringDesc,
} from "../../utils";
import type { ICoverListWithFiltersItem } from "./CoverListWithFilters";

export type Sort =
  | "sequence-desc"
  | "sequence-asc"
  | "year-published-desc"
  | "year-published-asc"
  | "title"
  | "grade-asc"
  | "grade-desc"
  | "author-asc"
  | "author-desc";

function sortItems(items: ICoverListWithFiltersItem[], sortOrder: Sort) {
  const sortMap: Record<
    Sort,
    (a: ICoverListWithFiltersItem, b: ICoverListWithFiltersItem) => number
  > = {
    "sequence-desc": (a, b) => sortNumberDesc(a.sequence ?? 0, b.sequence ?? 0),
    "sequence-asc": (a, b) => sortNumberAsc(a.sequence ?? 0, b.sequence ?? 0),
    "year-published-desc": (a, b) =>
      sortNumberDesc(a.yearPublished, b.yearPublished),
    "year-published-asc": (a, b) =>
      sortNumberAsc(a.yearPublished, b.yearPublished),
    title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
    "grade-asc": (a, b) =>
      sortNumberAsc(a.gradeValue ?? 50, b.gradeValue ?? 50),
    "grade-desc": (a, b) =>
      sortNumberDesc(a.gradeValue ?? -1, b.gradeValue ?? -1),
    "author-asc": (a, b) =>
      sortStringAsc(a.authors[0].sortName, b.authors[0].sortName),
    "author-desc": (a, b) =>
      sortStringDesc(a.authors[0].sortName, b.authors[0].sortName),
  };

  const comparer = sortMap[sortOrder];
  return items.sort(comparer);
}
/** The page state. */
interface State {
  /** All possible viewings. */
  allItems: ICoverListWithFiltersItem[];
  /** Viewings matching the current filters. */
  filteredItems: ICoverListWithFiltersItem[];
  /** The active filters. */
  filters: Record<string, (item: ICoverListWithFiltersItem) => boolean>;
  /** The number of viewings to show. */
  showCount: number;
  /** The active sort value. */
  sortValue: Sort;
  hideReviewed: boolean;
}

const SHOW_COUNT_DEFAULT = 24;

/**
 * Initializes the page state.
 */
export function initState({
  items,
  sort,
}: {
  items: ICoverListWithFiltersItem[];
  sort: Sort;
}): State {
  return {
    allItems: items,
    filteredItems: items,
    filters: {},
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: sort,
    hideReviewed: false,
  };
}

export enum ActionType {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_KIND = "FILTER_KIND",
  FILTER_EDITION = "FILTER_EDITION",
  FILTER_GRADE = "FILTER_GRADE",
  FILTER_YEAR_PUBLISHED = "FILTER_YEAR_PUBLISHED",
  FILTER_YEAR_READ = "FILTER_YEAR_READ",
  FILTER_AUTHOR = "FILTER_AUTHOR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
}
/** Action to filter by title. */
interface FilterTitleAction {
  type: ActionType.FILTER_TITLE;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by kind. */
interface FilterKindAction {
  type: ActionType.FILTER_KIND;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by author. */
interface FilterAuthorAction {
  type: ActionType.FILTER_AUTHOR;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by venue. */
interface FilterEditionAction {
  type: ActionType.FILTER_EDITION;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by grade. */
interface FilterGradeAction {
  type: ActionType.FILTER_GRADE;
  /** The values to filter on. */
  values: [number, number];
  includeAbandoned: boolean;
}

/** Action to filter by read year. */
interface FilterYearReadAction {
  type: ActionType.FILTER_YEAR_READ;
  /** The minimum and maximum years to bound the filter window. */
  values: [number, number];
}

/** Action to filter by published year. */
interface FilterYearPublishedAction {
  type: ActionType.FILTER_YEAR_PUBLISHED;
  /** The minimum and maximum years to bound the filter window. */
  values: [number, number];
}
/** Action to sort. */
interface SortAction {
  type: ActionType.SORT;
  /** The sorter to apply. */
  value: Sort;
}

interface ShowMoreAction {
  type: ActionType.SHOW_MORE;
}

/** Action to toggle reviewed. */
interface ToggleReviewedAction {
  type: ActionType.TOGGLE_REVIEWED;
}

export type Action =
  | FilterTitleAction
  | FilterYearReadAction
  | FilterYearPublishedAction
  | FilterKindAction
  | FilterGradeAction
  | FilterEditionAction
  | FilterAuthorAction
  | SortAction
  | ShowMoreAction
  | ToggleReviewedAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export function reducer(state: State, action: Action): State {
  // eslint-disable-line consistent-return
  let filters;
  let filteredItems;

  switch (action.type) {
    case ActionType.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      filters = {
        ...state.filters,
        title: (item: ICoverListWithFiltersItem) => {
          return regex.test(item.title);
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.FILTER_KIND: {
      filters = {
        ...state.filters,
        kind: (item: ICoverListWithFiltersItem) => {
          if (action.value === "All") {
            return true;
          }

          return item.kind === action.value;
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.FILTER_AUTHOR: {
      filters = {
        ...state.filters,
        author: (item: ICoverListWithFiltersItem) => {
          if (action.value === "All") {
            return true;
          }

          return item.authors.some((author) => author.name === action.value);
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.FILTER_EDITION: {
      filters = {
        ...state.filters,
        edition: (item: ICoverListWithFiltersItem) => {
          if (action.value === "All") {
            return true;
          }

          return item.edition === action.value;
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.FILTER_YEAR_PUBLISHED: {
      filters = {
        ...state.filters,
        publishedYear: (item: ICoverListWithFiltersItem) => {
          const yearPublished = item.yearPublished;
          return (
            yearPublished >= action.values[0] &&
            yearPublished <= action.values[1]
          );
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.FILTER_YEAR_READ: {
      filters = {
        ...state.filters,
        readYear: (item: ICoverListWithFiltersItem) => {
          const yearRead = item.yearFinished;

          if (!yearRead) {
            return true;
          }

          return yearRead >= action.values[0] && yearRead <= action.values[1];
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.FILTER_GRADE: {
      filters = {
        ...state.filters,
        grade: (item: ICoverListWithFiltersItem) => {
          const gradeValue = item.gradeValue;
          if (!gradeValue) {
            return action.includeAbandoned;
          }
          return (
            gradeValue >= action.values[0] && gradeValue <= action.values[1]
          );
        },
      };
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
      };
    }
    case ActionType.SORT: {
      filteredItems = sortItems(state.filteredItems, action.value);
      return {
        ...state,
        sortValue: action.value,
        filteredItems,
      };
    }
    case ActionType.SHOW_MORE: {
      return {
        ...state,
        showCount: state.showCount + SHOW_COUNT_DEFAULT,
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
          reviewed: (item: ICoverListWithFiltersItem) => {
            return item.slug === null;
          },
        };
      }
      filteredItems = sortItems(
        applyFilters<ICoverListWithFiltersItem>({
          collection: state.allItems,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredItems,
        hideReviewed: !state.hideReviewed,
      };
    }
    // no default
  }
}
