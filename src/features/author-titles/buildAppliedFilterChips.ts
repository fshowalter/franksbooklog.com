import type { FilterChip } from "~/components/filter-and-sort/AppliedFilters";

import { gradeToLetter } from "~/utils/grades";

import type { AuthorTitlesFiltersValues } from "./AuthorTitles.reducer";

/**
 * Builds an array of FilterChip objects from active filter values for the AuthorTitles page.
 *
 * @param filterValues - Active filter values (from state.activeFilterValues)
 * @param distinctWorkYears - Available work years for full-range detection
 * @param distinctReviewYears - Available review years for full-range detection
 * @returns Array of FilterChip objects representing active filters
 */
export function buildAppliedFilterChips(
  filterValues: AuthorTitlesFiltersValues,
  distinctWorkYears: readonly string[],
  distinctReviewYears: readonly string[],
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

  // Grade chip (range — omit when full range [2, 16])
  if (filterValues.gradeValue) {
    const [minGrade, maxGrade] = filterValues.gradeValue;
    if (minGrade !== 2 || maxGrade !== 16) {
      const minLetter = gradeToLetter(minGrade);
      const maxLetter = gradeToLetter(maxGrade);
      chips.push({
        category: "Grade",
        id: "gradeValue",
        label:
          minLetter === maxLetter ? minLetter : `${minLetter} to ${maxLetter}`,
      });
    }
  }

  // Review Year chip (range — omit when full range)
  if (filterValues.reviewYear && distinctReviewYears.length > 0) {
    const [minYear, maxYear] = filterValues.reviewYear;
    const availableMin = distinctReviewYears[0];
    const availableMax = distinctReviewYears.at(-1)!;
    if (minYear !== availableMin || maxYear !== availableMax) {
      chips.push({
        category: "Review Year",
        id: "reviewYear",
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
