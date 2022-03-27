import applyFilters from "../../utils/apply-filters";
import { sortNumberDesc, sortStringAsc } from "../../utils/sort-utils";
import type { Author } from "./AuthorsIndexPage";

export enum ActionType {
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
}

export type SortValue = "name" | "reviews" | "works";

function sortAuthors(authors: Author[], sortOrder: SortValue) {
  const sortMap: Record<SortValue, (a: Author, b: Author) => number> = {
    name: (a, b) => sortStringAsc(a.sortName, b.sortName),
    works: (a, b) => sortNumberDesc(a.workCount, b.workCount),
    reviews: (a, b) => sortNumberDesc(a.reviewedWorkCount, b.reviewedWorkCount),
  };

  const comparer = sortMap[sortOrder];

  return authors.sort(comparer);
}

/**
 * The page state.
 */
type State = {
  /** All possible reviews. */
  allAuthors: Author[];
  /** People matching the current filters. */
  filteredAuthors: Author[];
  /** The active filters. */
  filters: Record<string, (author: Author) => boolean>;
  /** The active sort value. */
  sortValue: SortValue;
};

export function initState({ authors }: { authors: Author[] }): State {
  return {
    allAuthors: authors,
    filteredAuthors: authors,
    filters: {},
    sortValue: "name",
  };
}

/** Action to filter by title. */
interface FilterNameAction {
  type: ActionType.FILTER_NAME;
  /** The value to filter on. */
  value: string;
}

interface SortAction {
  type: ActionType.SORT;
  /** The sorter to apply. */
  value: SortValue;
}

export type Action = FilterNameAction | SortAction;

/**
 * Applies the given action to the given state, returning a new State object.
 * @param state The current state.
 * @param action The action to apply.
 */
export function reducer(state: State, action: Action): State {
  let filters;
  let filteredAuthors;

  switch (action.type) {
    case ActionType.FILTER_NAME: {
      const regex = new RegExp(action.value, "i");
      filters = {
        ...state.filters,
        name: (author: Author) => {
          return regex.test(author.name);
        },
      };
      filteredAuthors = sortAuthors(
        applyFilters<Author>({
          collection: state.allAuthors,
          filters,
        }),
        state.sortValue
      );
      return {
        ...state,
        filters,
        filteredAuthors,
      };
    }
    case ActionType.SORT: {
      filteredAuthors = sortAuthors(state.filteredAuthors, action.value);
      return {
        ...state,
        sortValue: action.value,
        filteredAuthors,
      };
    }
    // no default
  }
}
