import { filterCollections } from "~/filterers/filterCollections";

import type { AuthorsValue } from "./Authors";
import type { AuthorsFiltersValues } from "./Authors.reducer";

/**
 * Filters cast and crew members based on credited role and name.
 * @param sortedValues - Array of cast/crew members to filter
 * @param filterValues - Object containing filter values including creditedAs and name
 * @returns Filtered array of cast/crew members
 */
export function filterAuthors(
  sortedValues: AuthorsValue[],
  filterValues: AuthorsFiltersValues,
) {
  return filterCollections(filterValues, sortedValues, []);
}
