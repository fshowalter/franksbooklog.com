import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import type { ReadingLogFiltersValues } from "./ReadingLog.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the ReadingLog page.
 *
 * @param filterValues - Active filter values (from state.activeFilterValues)
 * @param distinctWorkYears - Available work years for full-range detection
 * @param distinctReadingYears - Available reading years for full-range detection
 * @returns Array of FilterChip objects representing active filters
 */
export function buildAppliedFilterChips(
  filterValues: ReadingLogFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReadingYears: readonly string[],
): FilterChip[] {
  const chips: FilterChip[] = [];

  // Title search chip
  if (filterValues.title?.trim()) {
    chips.push({
      category: "Search",
      id: "title",
      label: filterValues.title,
    });
  }

  // Kind chips (multi-select, one chip per value)
  if (filterValues.kind && filterValues.kind.length > 0) {
    for (const kind of filterValues.kind) {
      chips.push({
        category: "Kind",
        id: `kind-${kind.toLowerCase().replaceAll(" ", "-")}`,
        label: kind,
      });
    }
  }

  // Edition chips (multi-select, one chip per value)
  if (filterValues.edition && filterValues.edition.length > 0) {
    for (const edition of filterValues.edition) {
      chips.push({
        category: "Edition",
        id: `edition-${edition.toLowerCase().replaceAll(" ", "-")}`,
        label: edition,
      });
    }
  }

  // Work Year chip (range — omit when full range)
  if (filterValues.workYear && distinctWorkYears.length > 0) {
    const [minYear, maxYear] = filterValues.workYear;
    const availableMin = distinctWorkYears[0];
    const availableMax = distinctWorkYears.at(-1)!;
    if (minYear !== availableMin || maxYear !== availableMax) {
      chips.push({
        category: "Work Year",
        id: "workYear",
        label: minYear === maxYear ? minYear : `${minYear} to ${maxYear}`,
      });
    }
  }

  // Reading Year chip (range — omit when full range)
  if (filterValues.readingYear && distinctReadingYears.length > 0) {
    const [minYear, maxYear] = filterValues.readingYear;
    const availableMin = distinctReadingYears[0];
    const availableMax = distinctReadingYears.at(-1)!;
    if (minYear !== availableMin || maxYear !== availableMax) {
      chips.push({
        category: "Reading Year",
        id: "readingYear",
        label: minYear === maxYear ? minYear : `${minYear} to ${maxYear}`,
      });
    }
  }

  // Reviewed Status chips (multi-select, one chip per value)
  if (filterValues.reviewedStatus && filterValues.reviewedStatus.length > 0) {
    for (const status of filterValues.reviewedStatus) {
      chips.push({
        category: "Status",
        id: `reviewedStatus-${status.toLowerCase().replaceAll(" ", "-")}`,
        label: status,
      });
    }
  }

  return chips;
}
