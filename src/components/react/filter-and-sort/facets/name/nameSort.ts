import { sortString } from "~/components/react/filter-and-sort/facets/createSorter";

export const nameSortComparators = {
  "name-asc": (a: { sortName: string }, b: { sortName: string }) =>
    sortString(a.sortName, b.sortName),
  "name-desc": (a: { sortName: string }, b: { sortName: string }) =>
    sortString(a.sortName, b.sortName) * -1,
};
