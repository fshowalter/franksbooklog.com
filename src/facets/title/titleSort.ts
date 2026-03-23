import { sortString } from "~/facets/createSorter";

type SortableByTitle = {
  sortTitle: string;
};

type TitleSortKeys = "title-asc" | "title-desc";

export const titleSortComparators: Record<
  TitleSortKeys,
  (a: SortableByTitle, b: SortableByTitle) => number
> = {
  "title-asc": (a, b) => sortString(a.sortTitle, b.sortTitle),
  "title-desc": (a, b) => sortString(a.sortTitle, b.sortTitle) * -1,
};
