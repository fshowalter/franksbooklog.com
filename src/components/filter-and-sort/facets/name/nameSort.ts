import { sortString } from "~/components/filter-and-sort/facets/createSorter";
export type NameSortKeys = "name-asc" | "name-desc";

type SortableByName = {
  sortName: string;
};

export const nameSortComparators: Record<
  NameSortKeys,
  (a: SortableByName, b: SortableByName) => number
> = {
  "name-asc": (a: { sortName: string }, b: { sortName: string }) =>
    sortString(a.sortName, b.sortName),
  "name-desc": (a: { sortName: string }, b: { sortName: string }) =>
    sortString(a.sortName, b.sortName) * -1,
};

export const nameSortOptions = [
  { label: "Name (A \u2192 Z)", value: "name-asc" },
  { label: "Name (Z \u2192 A)", value: "name-desc" },
];
