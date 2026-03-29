import { sortString } from "~/components/filter-and-sort/facets/createSorter";
export type NameSortKeys = "name-asc" | "name-desc";

export type SortableByName = {
  sortName: string;
};

export const nameSortComparators: Record<
  NameSortKeys,
  (a: SortableByName, b: SortableByName) => number
> = {
  "name-asc": (a, b) => sortString(a.sortName, b.sortName),
  "name-desc": (a, b) => sortString(b.sortName, a.sortName),
};

export const nameSortOptions = [
  { label: "Name (A \u2192 Z)", value: "name-asc" },
  { label: "Name (Z \u2192 A)", value: "name-desc" },
];
