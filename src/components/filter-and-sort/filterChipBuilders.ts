import type { FilterChip } from "./AppliedFilters";

import { gradeToLetter } from "~/utils/grades";

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

/**
 * Builds a grade-range chip for the grade slider filter (scale 2–16).
 * Returns an empty array when the selected range covers the full scale.
 */
export function buildGradeChip(
  value: readonly [number, number] | undefined,
): FilterChip[] {
  if (!value) return [];
  const [minGrade, maxGrade] = value;
  if (minGrade === 2 && maxGrade === 16) return [];
  const minLetter = gradeToLetter(minGrade);
  const maxLetter = gradeToLetter(maxGrade);
  const label =
    minLetter === maxLetter ? minLetter : `${minLetter} to ${maxLetter}`;
  return [
    {
      category: "Grade",
      displayText: `Grade: ${label}`,
      id: "gradeValue",
      label,
    },
  ];
}
