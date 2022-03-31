import applyFilters from "../../utils/apply-filters";
import {
  collator,
  sortNumberAsc,
  sortNumberDesc,
  sortStringAsc,
  sortStringDesc,
} from "../../utils/sort-utils";
import type { Work } from "./ShelfPage";

export enum ActionType {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_AUTHOR = "FILTER_AUTHOR",
  FILTER_KIND = "FILTER_KIND",
  FILTER_PUBLISHED_YEAR = "FILTER_PUBLISHED_YEAR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
  TOGGLE_REVIEWED = "TOGGLE_REVIEWED",
}

export type SortType =
  | "author-asc"
  | "author-desc"
  | "published-date-asc"
  | "published-date-desc"
  | "title";

/**
 * Sorts a given collection of watchlist movies using the given sort function key.
 * @param titles The collection to sort.
 * @param sortOrder The sort function key.
 */
function sortWorks(titles: Work[], sortOrder: SortType) {
  const sortMap: Record<SortType, (a: Work, b: Work) => number> = {
    "published-date-asc": (a, b) => sortNumberAsc(a.year, b.year),
    "published-date-desc": (a, b) => sortNumberDesc(a.year, b.year),
    "author-asc": (a, b) =>
      sortStringAsc(a.authors[0].sortName, b.authors[0].sortName),
    "author-desc": (a, b) =>
      sortStringDesc(a.authors[0].sortName, b.authors[0].sortName),
    title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
  };

  const comparer = sortMap[sortOrder];
  return titles.sort(comparer);
}

type State = {
  /** All possible works. */
  allWorks: Work[];
  /** Works matching the current filters. */
  filteredWorks: Work[];
  /** Number of movies to show on the page. */
  showCount: number;
  /** The active filters. */
  filters: Record<string, (work: Work) => boolean>;
  // /** The minimum year for the published date filter. */
  // minYear: number;
  // /** The maximum year for the published date filter. */
  // maxYear: number;
  /** The active sort value. */
  sortValue: SortType;
  /** True if reviewed items are currently hidden. */
  hideReviewed: boolean;
};

const SHOW_COUNT_DEFAULT = 24;

/**
 * Initializes the page state.
 */
export function initState({ works }: { works: Work[] }): State {
  // const [minYear, maxYear] = minMaxReleaseYearsForMovies(movies);

  return {
    allWorks: works,
    filteredWorks: works,
    showCount: SHOW_COUNT_DEFAULT,
    filters: {},
    sortValue: "author-asc",
    hideReviewed: false,
    // minYear,
    // maxYear,
  };
}

/** Action to filter by title. */
interface FilterTitleAction {
  type: ActionType.FILTER_TITLE;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by author. */
interface FilterAuthorAction {
  type: ActionType.FILTER_AUTHOR;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by kind. */
interface FilterKindAction {
  type: ActionType.FILTER_KIND;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by published year. */
interface FilterPublishedYearAction {
  type: ActionType.FILTER_PUBLISHED_YEAR;
  /** The minimum and maximum years to bound the filter window. */
  values: [number, number];
}

/** Action to sort. */
interface SortAction {
  type: ActionType.SORT;
  /** The sorter to apply. */
  value: SortType;
}

/** Action to change page. */
interface ShowMoreAction {
  type: ActionType.SHOW_MORE;
}

/** Action to toggle reviewed. */
interface ToggleReviewedAction {
  type: ActionType.TOGGLE_REVIEWED;
}

type Action =
  | FilterTitleAction
  | FilterAuthorAction
  | FilterPublishedYearAction
  | FilterKindAction
  | SortAction
  | ToggleReviewedAction
  | ShowMoreAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export default function reducer(state: State, action: Action): State {
  let filters;
  let filteredWorks;

  switch (action.type) {
    case ActionType.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      filters = {
        ...state.filters,
        title: (work: Work) => {
          return regex.test(work.title);
        },
      };
      filteredWorks = sortWorks(
        applyFilters<Work>({ collection: state.allWorks, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredWorks,
        showCount: SHOW_COUNT_DEFAULT,
      };
    }
    case ActionType.FILTER_AUTHOR: {
      filters = {
        ...state.filters,
        author: (work: Work) => {
          if (action.value === "All") {
            return true;
          }

          return work.authors.some((author) => author.name === action.value);
        },
      };
      filteredWorks = sortWorks(
        applyFilters<Work>({ collection: state.allWorks, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredWorks,
        showCount: SHOW_COUNT_DEFAULT,
      };
    }
    case ActionType.FILTER_KIND: {
      filters = {
        ...state.filters,
        kind: (work: Work) => {
          if (action.value === "All") {
            return true;
          }

          return work.kind === action.value;
        },
      };
      filteredWorks = sortWorks(
        applyFilters<Work>({ collection: state.allWorks, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredWorks,
        showCount: SHOW_COUNT_DEFAULT,
      };
    }
    case ActionType.FILTER_PUBLISHED_YEAR: {
      filters = {
        ...state.filters,
        publishedYear: (work: Work) => {
          const publishedYear = work.year;
          return (
            publishedYear >= action.values[0] &&
            publishedYear <= action.values[1]
          );
        },
      };
      filteredWorks = sortWorks(
        applyFilters<Work>({ collection: state.allWorks, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredWorks,
        showCount: SHOW_COUNT_DEFAULT,
      };
    }
    case ActionType.SORT: {
      filteredWorks = sortWorks(state.filteredWorks, action.value);
      return {
        ...state,
        sortValue: action.value,
        filteredWorks,
        showCount: SHOW_COUNT_DEFAULT,
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
          reviewed: (work: Work) => {
            return work.reviewed === null;
          },
        };
      }
      filteredWorks = sortWorks(
        applyFilters<Work>({ collection: state.allWorks, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredWorks,
        hideReviewed: !state.hideReviewed,
      };
    }
    // no default
  }
}
