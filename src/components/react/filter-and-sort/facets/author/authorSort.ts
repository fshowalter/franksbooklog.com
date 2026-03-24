import { sortString } from "~/components/react/filter-and-sort/facets/createSorter";

type AuthorSortKeys = "author-asc" | "author-desc";

type SortableByAuthor = {
  authors: readonly { sortName: string }[];
};

export const authorSortComparators: Record<
  AuthorSortKeys,
  (a: SortableByAuthor, b: SortableByAuthor) => number
> = {
  "author-asc": (a, b) =>
    sortString(a.authors[0].sortName, b.authors[0].sortName),
  "author-desc": (a, b) =>
    sortString(a.authors[0].sortName, b.authors[0].sortName) * -1,
};
