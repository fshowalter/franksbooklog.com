export {
  createGroupValues,
  createSelectSortedFilteredValues,
  createSortValues,
} from "./sorter";

import { getGroupLetter, sortNumber, sortString } from "./sorter";

export type CollectionSort =
  | "name-asc"
  | "name-desc"
  | "review-count-asc"
  | "review-count-desc";

type SortableCollection = {
  name: string;
  reviewCount: number;
};

export function createCollectionSortMap<TValue extends SortableCollection>() {
  return {
    ...sortName<TValue>(),
    ...sortReviewCount<TValue>(),
  };
}

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

function sortName<TValue extends SortableCollection>() {
  return {
    "name-asc": (a: TValue, b: TValue) => sortString(a.name, b.name),
    "name-desc": (a: TValue, b: TValue) => sortString(a.name, b.name) * -1,
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
