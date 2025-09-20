import type { GroupFn } from "~/groupers/groupValues";

import { getGroupLetter, groupValues } from "~/groupers/groupValues";

type GroupableCollection = {
  name: string;
  reviewCount: number;
};

/**
 * Groups collections by name letter or custom grouping function.
 * @param filteredValues - Array of collections to group
 * @param sort - Current sort configuration
 * @param extraGrouper - Optional custom grouping function
 * @returns Map of grouped collections
 */
export function groupCollections<
  TValue extends GroupableCollection,
  TSort extends string,
>(
  filteredValues: TValue[],
  sort: TSort,
  extraGrouper?: GroupFn<TValue, TSort>,
) {
  return groupValues(
    filteredValues,
    sort,
    createGroupForCollection(extraGrouper),
  );
}

function createGroupForCollection<
  TValue extends GroupableCollection,
  TSort extends string,
>(grouper: GroupFn<TValue, TSort> = () => "") {
  return function groupForTitleValue(value: TValue, sort: TSort) {
    switch (sort) {
      case "name-asc":
      case "name-desc": {
        return getGroupLetter(value.name);
      }
      case "review-count-asc":
      case "review-count-desc": {
        return "";
      }
      default: {
        return grouper(value, sort);
      }
    }
  };
}
