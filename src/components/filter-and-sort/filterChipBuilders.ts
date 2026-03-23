import { toChipSlug } from "~/facets/toChipSlug";

import type { FilterChip } from "./AppliedFilters";

/**
 * Builds one chip per selected value for a multi-select filter.
 * Returns an empty array if values is empty or undefined.
 */
export function buildMultiSelectChips(
  values: readonly string[] | undefined,
  category: string,
  idPrefix: string,
): FilterChip[] {
  if (!values || values.length === 0) return [];
  return values.map((value) => ({
    category,
    displayText: value,
    id: `${idPrefix}-${toChipSlug(value)}`,
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
