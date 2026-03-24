import {
  createSorter,
  sortNumber,
} from "~/components/react/filter-and-sort/facets/createSorter";
import { nameSortComparators } from "~/components/react/filter-and-sort/facets/name/nameSort";

export type CollectionSort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

type SortableCollection = {
  reviewCount: number;
  sortName: string;
};

/**
 * Creates a collection sorter function with support for name and review count sorting.
 * @param sortMap - Optional additional sort functions to extend the default sorts
 * @returns Sorter function that sorts collections by the specified criteria
 */
export function createCollectionSorter<
  TValue extends SortableCollection,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createSorter<TValue, TSort>({
    ...nameSortComparators,
    ...sortReviewCount<TValue>(),
    ...sortMap,
  });

  return function collectionSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}

function sortReviewCount<TValue extends SortableCollection>() {
  return {
    "review-count-asc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewCount, b.reviewCount),
    "review-count-desc": (a: TValue, b: TValue) =>
      sortNumber(a.reviewCount, b.reviewCount) * -1,
  };
}
