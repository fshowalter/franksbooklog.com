export {
  createGroupValues,
  createSelectSortedFilteredValues,
  createSortValues,
} from "./sorter";

import { getGroupLetter, sortNumber, sortString } from "./sorter";

/**
 * Available sort options for collections (authors, genres, etc.).
 * Includes sorting by name and review count in both directions.
 */
export type CollectionSort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

/**
 * Interface for collection items that can be sorted.
 * Contains the basic fields needed for sorting collection data.
 */
type SortableCollection = {
  /** Display name of the collection item */
  name: string;
  /** Number of reviews associated with this collection item */
  reviewCount: number;
};

/**
 * Creates a complete sort map for collections.
 * Combines name and review count sort functions into a single mapping object.
 * 
 * @template TValue - Type extending SortableCollection
 * @returns Object mapping sort keys to comparison functions
 */
export function createCollectionSortMap<TValue extends SortableCollection>() {
  return {
    ...sortName<TValue>(),
    ...sortReviewCount<TValue>(),
  };
}

/**
 * Creates a function to select and group collection values.
 * Higher-order function that applies grouping to collection values.
 * 
 * @template TValue - The type of values being grouped
 * @template TSort - The type of sort criteria
 * @param groupFn - Function that groups values based on sort criteria
 * @returns Function that applies grouping to sorted values
 */
export function createSelectGroupedValues<TValue, TSort>(
  groupFn: (values: TValue[], sort: TSort) => Map<string, TValue[]>,
) {
  return function selectGroupedValues(
    sortedValues: TValue[],
    sort: TSort,
  ): Map<string, TValue[]> {
    return groupFn(sortedValues, sort);
  };
}

/**
 * Determines the group key for a collection item based on sort criteria.
 * Returns appropriate grouping value (letter for name sorts, empty for count sorts).
 * 
 * @template TSort - The specific sort type being used
 * @param value - The collection item to group
 * @param sort - The current sort criteria
 * @returns String key for grouping this item
 */
export function groupForSortableReviewedWork<TSort extends CollectionSort>(
  value: SortableCollection,
  sort: TSort,
): string {
  switch (sort) {
    case "name-asc":
    case "name-desc": {
      return getGroupLetter(value.name);
    }
    case "review-count-asc":
    case "review-count-desc": {
      return "";
    }
  }
}

/**
 * Creates name-based sort functions.
 * 
 * @template TValue - Type extending SortableCollection
 * @returns Object with name sort functions
 */
function sortName<TValue extends SortableCollection>() {
  return {
    "name-asc": (a: TValue, b: TValue) => sortString(a.name, b.name),
    "name-desc": (a: TValue, b: TValue) => sortString(a.name, b.name) * -1,
  };
}

/**
 * Creates review count-based sort functions.
 * 
 * @template TValue - Type extending SortableCollection
 * @returns Object with review count sort functions
 */
function sortReviewCount<TValue extends SortableCollection>() {
  return {
    "review-count-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewCount, b.reviewCount),
    "review-count-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewCount, b.reviewCount) * -1,
  };
}
