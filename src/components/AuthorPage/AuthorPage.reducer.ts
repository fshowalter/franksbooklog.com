import applyFilters from "../../utils/apply-filters";
import {
  collator,
  sortNumberAsc,
  sortNumberDesc,
} from "../../utils/sort-utils";
import type { Work } from "./AuthorPage";

export type SortType =
  | "year-published-asc"
  | "year-published-desc"
  | "title"
  | "grade-asc"
  | "grade-desc";

function sortWorks(works: Work[], sortType: SortType) {
  const sortMap: Record<SortType, (a: Work, b: Work) => number> = {
    "year-published-asc": (a, b) => sortNumberAsc(a.year, b.year),
    "year-published-desc": (a, b) => sortNumberDesc(a.year, b.year),
    title: (a, b) => collator.compare(a.sortTitle, b.sortTitle),
    "grade-asc": (a, b) =>
      sortNumberAsc(a.lastReviewGradeValue || 50, b.lastReviewGradeValue || 50),
    "grade-desc": (a, b) =>
      sortNumberDesc(
        a.lastReviewGradeValue || -1,
        b.lastReviewGradeValue || -1
      ),
  };

  const comparer = sortMap[sortType];

  return works.sort(comparer);
}

function reviewedWorkCount(works: Work[]): number {
  return works.filter((work) => work.reviewed).length;
}

/**
 * The page state.
 */
type State = {
  /** All possible works. */
  allWorks: Work[];
  /** Wroks matching the current filters. */
  filteredWorks: Work[];
  /** Number of works to show on the page. */
  showCount: number;
  /** The active filters. */
  filters: Record<string, (work: Work) => boolean>;
  /** The reviewed movie count */
  reviewedWorkCount: number;
  /** The active sort type. */
  sortType: SortType;
};

const SHOW_COUNT_DEFAULT = 24;

export function initState({ works }: { works: Work[] }): State {
  return {
    allWorks: works,
    filteredWorks: works,
    showCount: SHOW_COUNT_DEFAULT,
    filters: {},
    reviewedWorkCount: reviewedWorkCount(works),
    sortType: "year-published-asc",
  };
}

export enum ActionType {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_KIND = "FILTER_KIND",
  FILTER_PUBLISHED_YEAR = "FILTER_PUBLISHED_YEAR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

/** Action to filter by title. */
interface FilterTitleAction {
  type: ActionType.FILTER_TITLE;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by kind. */
interface FilterKindeAction {
  type: ActionType.FILTER_KIND;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by title. */
interface FilterPublishedYearAction {
  type: ActionType.FILTER_PUBLISHED_YEAR;
  /** The minimum and maximum years to bound the filter window. */
  values: [number, number];
}

interface SortAction {
  type: ActionType.SORT;
  /** The sorter to apply. */
  value: SortType;
}

/** Action to change page. */
interface ShowMoreAction {
  type: ActionType.SHOW_MORE;
}

type Action =
  | FilterTitleAction
  | FilterKindeAction
  | FilterPublishedYearAction
  | SortAction
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
        state.sortType
      );
      return {
        ...state,
        filters,
        filteredWorks,
        reviewedWorkCount: reviewedWorkCount(filteredWorks),
      };
    }
    case ActionType.FILTER_KIND: {
      filters = {
        ...state.filters,
        kind: (work: Work) => {
          return work.kind === action.value;
        },
      };
      filteredWorks = sortWorks(
        applyFilters<Work>({ collection: state.allWorks, filters }),
        state.sortType
      );
      return {
        ...state,
        filters,
        filteredWorks,
        reviewedWorkCount: reviewedWorkCount(filteredWorks),
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
        state.sortType
      );
      return {
        ...state,
        filters,
        filteredWorks,
        reviewedWorkCount: reviewedWorkCount(filteredWorks),
      };
    }
    case ActionType.SHOW_MORE: {
      return {
        ...state,
        showCount: state.showCount + SHOW_COUNT_DEFAULT,
      };
    }
    case ActionType.SORT: {
      filteredWorks = sortWorks(state.filteredWorks, action.value);
      return {
        ...state,
        sortType: action.value,
        filteredWorks,
      };
    }
    // no default
  }
}
