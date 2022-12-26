import { applyFilters, sortStringAsc, sortStringDesc } from "../../utils";

export enum ActionType {
  FILTER_NAME = "FILTER_NAME",
  SORT = "SORT",
}

export type Sort = "name-asc" | "name-desc";

function sortAuthors(
  authors: Queries.AuthorAvatarListItemFragment[],
  sortOrder: Sort
) {
  const sortMap: Record<
    Sort,
    (
      a: Queries.AuthorAvatarListItemFragment,
      b: Queries.AuthorAvatarListItemFragment
    ) => number
  > = {
    "name-asc": (a, b) => sortStringAsc(a.sortName, b.sortName),
    "name-desc": (a, b) => sortStringDesc(a.sortName, b.sortName),
  };

  const comparer = sortMap[sortOrder];

  return authors.sort(comparer);
}

/**
 * The page state.
 */
interface State {
  /** All possible reviews. */
  allAuthors: Queries.AuthorAvatarListItemFragment[];
  /** People matching the current filters. */
  filteredAuthors: Queries.AuthorAvatarListItemFragment[];
  /** The active filters. */
  filters: Record<
    string,
    (author: Queries.AuthorAvatarListItemFragment) => boolean
  >;
  /** The active sort value. */
  sortValue: Sort;
}

export function initState({
  authors,
}: {
  authors: readonly Queries.AuthorAvatarListItemFragment[];
}): State {
  return {
    allAuthors: [...authors],
    filteredAuthors: [...authors],
    filters: {},
    sortValue: "name-asc",
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
  value: Sort;
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
        name: (author: Queries.AuthorAvatarListItemFragment) => {
          return regex.test(author.name);
        },
      };
      filteredAuthors = sortAuthors(
        applyFilters<Queries.AuthorAvatarListItemFragment>({
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
