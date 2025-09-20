import { groupCollections } from "~/groupers/groupCollections";

import type { AuthorsValue } from "./Authors";
import type { AuthorsSort } from "./sortAuthors";

/**
 * Groups cast and crew members based on the current sort criteria.
 * @param filteredValues - Array of filtered cast/crew members
 * @param sort - Current sort criteria
 * @returns Grouped cast/crew members
 */
export function groupAuthors(
  filteredValues: AuthorsValue[],
  sort: AuthorsSort,
) {
  return groupCollections(filteredValues, sort);
}
