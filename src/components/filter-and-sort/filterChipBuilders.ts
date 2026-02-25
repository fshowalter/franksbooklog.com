import { GRADE_MAX, GRADE_MIN, gradeToLetter } from "~/utils/grades";

import type { FilterChip } from "./AppliedFilters";

// AIDEV-NOTE: This ID must match the `gradeValue` property key in ReviewedTitleFiltersValues.
// filtersReducer.removeAppliedFilter deletes pendingFilterValues[action.id], so the chip ID
// and the filter-values key must stay in sync. If you rename either, update the other.
const GRADE_CHIP_ID = "gradeValue" as const;

/**
 * Builds a grade-range chip for the grade slider filter (scale 2–16).
 * Returns an empty array when the selected range covers the full scale.
 */
export function buildGradeChip(
  value: readonly [number, number] | undefined,
): FilterChip[] {
  if (!value) return [];
  const [minGrade, maxGrade] = value;
  if (minGrade === GRADE_MIN && maxGrade === GRADE_MAX) return [];
  const minLetter = gradeToLetter(minGrade);
  const maxLetter = gradeToLetter(maxGrade);
  const label =
    minLetter === maxLetter ? minLetter : `${minLetter} to ${maxLetter}`;
  return [
    {
      category: "Grade",
      displayText: `Grade: ${label}`,
      id: GRADE_CHIP_ID,
      label,
    },
  ];
}

/**
 * Builds one chip per selected value for a multi-select filter.
 * Returns an empty array if values is empty or undefined.
 */
export function buildMultiSelectChips(
  values: string[] | undefined,
  category: string,
  idPrefix: string,
): FilterChip[] {
  if (!values || values.length === 0) return [];
  return values.map((value) => ({
    category,
    displayText: value,
    id: `${idPrefix}-${value.toLowerCase().replaceAll(" ", "-")}`,
    label: value,
  }));
}

/**
 * Builds a search chip for a text search field.
 * Returns an empty array if the value is blank or undefined.
 */
export function buildSearchChip(
  value: string | undefined,
  fieldId: string,
): FilterChip[] {
  const trimmed = value?.trim();
  if (!trimmed) return [];
  return [
    {
      category: "Search",
      displayText: `Search: ${trimmed}`,
      id: fieldId,
      label: trimmed,
    },
  ];
}

/**
 * Builds a year-range chip for a range slider filter.
 * Returns an empty array when the selected range equals the full available range.
 */
export function buildYearRangeChip(
  value: readonly [string, string] | undefined,
  distinctYears: readonly string[],
  category: string,
  fieldId: string,
): FilterChip[] {
  if (!value || distinctYears.length === 0) return [];
  const [minYear, maxYear] = value;
  const availableMin = distinctYears[0];
  const availableMax = distinctYears.at(-1)!;
  if (minYear === availableMin && maxYear === availableMax) return [];
  const label = minYear === maxYear ? minYear : `${minYear} to ${maxYear}`;
  return [
    {
      category,
      displayText: `${category}: ${label}`,
      id: fieldId,
      label,
    },
  ];
}
