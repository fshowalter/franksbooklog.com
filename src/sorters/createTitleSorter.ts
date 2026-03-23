import { titleSortComparators } from "~/facets/title/titleSort";
import { workYearSortComparators } from "~/facets/work-year/workYearSort";

import { createSorter } from "./createSorter";

/**
 * Interface for reviewed work items that can be sorted.
 * Contains all the fields necessary for sorting and grouping reviewed works.
 */
export type SortableTitle = {
  /** Normalized title for sorting (typically lowercase) */
  sortTitle: string;
  /** Year the work was published */
  workYear: string;
};

/**
 * Available sort options for titles.
 * Includes sorting by release date and title in both directions.
 */
export type TitleSort =
  | "title-asc"
  | "title-desc"
  | "work-year-asc"
  | "work-year-desc";

/**
 * Creates a title sorter function with default and custom sort options.
 * @param sortMap - Optional additional sort functions
 * @returns Function that sorts titles based on the provided sort parameter
 */
export function createTitleSorter<
  TValue extends SortableTitle,
  TSort extends string,
>(sortMap?: Record<string, (a: TValue, b: TValue) => number>) {
  const sorter = createSorter<TValue, TSort>({
    ...titleSortComparators,
    ...workYearSortComparators,
    ...sortMap,
  });

  return function titleSorter(values: TValue[], sort: TSort) {
    return sorter(values, sort);
  };
}
