import applyFilters from "../../utils/apply-filters";
import {
  collator,
  sortNumberAsc,
  sortNumberDesc,
} from "../../utils/sort-utils";
import type { Review } from "./ReviewsIndexPage";

export type SortType =
  | "read-date-desc"
  | "read-date-asc"
  | "published-date-desc"
  | "published-date-asc"
  | "title"
  | "grade-asc"
  | "grade-desc";

function sortReviews(reviews: Review[], sortOrder: SortType) {
  const sortMap: Record<SortType, (a: Review, b: Review) => number> = {
    "read-date-desc": (a, b) =>
      sortNumberDesc(a.frontmatter.sequence, b.frontmatter.sequence),
    "read-date-asc": (a, b) =>
      sortNumberAsc(a.frontmatter.sequence, b.frontmatter.sequence),
    "published-date-desc": (a, b) =>
      sortNumberDesc(a.reviewedWork.year, b.reviewedWork.year),
    "published-date-asc": (a, b) =>
      sortNumberAsc(a.reviewedWork.year, b.reviewedWork.year),
    title: (a, b) =>
      collator.compare(a.reviewedWork.sortTitle, b.reviewedWork.sortTitle),
    "grade-asc": (a, b) =>
      sortNumberAsc(a.gradeValue || 50, b.gradeValue || 50),
    "grade-desc": (a, b) =>
      sortNumberDesc(a.gradeValue || -1, b.gradeValue || -1),
  };

  const comparer = sortMap[sortOrder];
  return reviews.sort(comparer);
}

/** The page state. */
type State = {
  /** All possible reviews. */
  allReviews: Review[];
  /** Reviews matching the current filters. */
  filteredReviews: Review[];
  /** The active filters. */
  filters: Record<string, (review: Review) => boolean>;
  /** The number of reviews to show. */
  showCount: number;
  /** The active sort value. */
  sortValue: SortType;
};

const SHOW_COUNT_DEFAULT = 24;

/**
 * Initializes the page state.
 */
export function initState({ reviews }: { reviews: Review[] }): State {
  return {
    allReviews: reviews,
    filteredReviews: reviews,
    filters: {},
    showCount: SHOW_COUNT_DEFAULT,
    sortValue: "read-date-desc",
  };
}

export enum ActionTypes {
  FILTER_TITLE = "FILTER_TITLE",
  FILTER_KIND = "FILTER_KIND",
  FILTER_EDITION = "FILTER_EDITION",
  FILTER_GRADE = "FILTER_GRADE",
  FILTER_PUBLISHED_YEAR = "FILTER_PUBLISHED_YEAR",
  FILTER_READ_YEAR = "FILTER_READ_YEAR",
  SORT = "SORT",
  SHOW_MORE = "SHOW_MORE",
}

/** Action to filter by title. */
interface FilterTitleAction {
  type: ActionTypes.FILTER_TITLE;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by kind. */
interface FilterKindAction {
  type: ActionTypes.FILTER_KIND;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by venue. */
interface FilterEditionAction {
  type: ActionTypes.FILTER_EDITION;
  /** The value to filter on. */
  value: string;
}

/** Action to filter by grade. */
interface FilterGradeAction {
  type: ActionTypes.FILTER_GRADE;
  /** The values to filter on. */
  values: [number, number];
}

/** Action to filter by read year. */
interface FilterReadYearAction {
  type: ActionTypes.FILTER_READ_YEAR;
  /** The minimum and maximum years to bound the filter window. */
  values: [number, number];
}

/** Action to filter by published year. */
interface FilterPublishedYearAction {
  type: ActionTypes.FILTER_PUBLISHED_YEAR;
  /** The minimum and maximum years to bound the filter window. */
  values: [number, number];
}

/** Action to sort. */
interface SortAction {
  type: ActionTypes.SORT;
  /** The sorter to apply. */
  value: SortType;
}

interface ShowMoreAction {
  type: ActionTypes.SHOW_MORE;
}

type Action =
  | FilterTitleAction
  | FilterReadYearAction
  | FilterPublishedYearAction
  | FilterKindAction
  | FilterGradeAction
  | FilterEditionAction
  | SortAction
  | ShowMoreAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export default function reducer(state: State, action: Action): State {
  // eslint-disable-line consistent-return
  let filters;
  let filteredReviews;

  switch (action.type) {
    case ActionTypes.FILTER_TITLE: {
      const regex = new RegExp(action.value, "i");
      filters = {
        ...state.filters,
        title: (review: Review) => {
          return regex.test(review.reviewedWork.title);
        },
      };
      filteredReviews = sortReviews(
        applyFilters<Review>({ collection: state.allReviews, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
      };
    }
    case ActionTypes.FILTER_KIND: {
      filters = {
        ...state.filters,
        venue: (review: Review) => {
          if (action.value === "All") {
            return true;
          }

          return review.reviewedWork.kind === action.value;
        },
      };
      filteredReviews = sortReviews(
        applyFilters<Review>({ collection: state.allReviews, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
      };
    }
    case ActionTypes.FILTER_EDITION: {
      filters = {
        ...state.filters,
        edition: (review: Review) => {
          if (action.value === "All") {
            return true;
          }

          return review.frontmatter.edition === action.value;
        },
      };
      filteredReviews = sortReviews(
        applyFilters<Review>({ collection: state.allReviews, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
      };
    }
    case ActionTypes.FILTER_PUBLISHED_YEAR: {
      filters = {
        ...state.filters,
        publishedYear: (review: Review) => {
          const publishedYear = review.reviewedWork.year;
          return (
            publishedYear >= action.values[0] &&
            publishedYear <= action.values[1]
          );
        },
      };
      filteredReviews = sortReviews(
        applyFilters<Review>({ collection: state.allReviews, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
      };
    }
    case ActionTypes.FILTER_READ_YEAR: {
      filters = {
        ...state.filters,
        readYear: (review: Review) => {
          const readYear = review.yearFinished;
          return readYear >= action.values[0] && readYear <= action.values[1];
        },
      };
      filteredReviews = sortReviews(
        applyFilters<Review>({ collection: state.allReviews, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
      };
    }
    case ActionTypes.FILTER_GRADE: {
      filters = {
        ...state.filters,
        grade: (review: Review) => {
          const gradeValue = review.gradeValue;
          return (
            gradeValue >= action.values[0] && gradeValue <= action.values[1]
          );
        },
      };
      filteredReviews = sortReviews(
        applyFilters<Review>({ collection: state.allReviews, filters }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredReviews,
      };
    }
    case ActionTypes.SORT: {
      filteredReviews = sortReviews(state.filteredReviews, action.value);
      return {
        ...state,
        sortValue: action.value,
        filteredReviews,
      };
    }
    case ActionTypes.SHOW_MORE: {
      return {
        ...state,
        showCount: state.showCount + SHOW_COUNT_DEFAULT,
      };
    }
    // no default
  }
}
