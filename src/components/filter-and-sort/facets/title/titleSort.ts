import { sortString } from "~/components/filter-and-sort/facets/createSorter";

export type SortableByTitle = {
  sortTitle: string;
};

export type TitleSortKeys = "title-asc" | "title-desc";

export const titleSortComparators: Record<
  TitleSortKeys,
  (a: SortableByTitle, b: SortableByTitle) => number
> = {
  "title-asc": (a, b) => sortString(a.sortTitle, b.sortTitle),
  "title-desc": (a, b) => sortString(b.sortTitle, a.sortTitle),
};

export const titleSortOptions = [
  { label: "Title (A \u2192 Z)", value: "title-asc" },
  { label: "Title (Z \u2192 A)", value: "title-desc" },
];
