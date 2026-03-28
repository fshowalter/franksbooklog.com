import type { FilterChip } from "~/components/filter-and-sort/container/FilterAndSortContainer";

/**
 * Builds one chip per selected value for a multi-select filter.
 * Returns an empty array if values is empty or undefined.
 */
export function buildMultiSelectChips({
  key,
  values,
}: {
  key: string;
  values: readonly string[] | undefined;
}): FilterChip[] {
  if (!values || values.length === 0) return [];
  return values.map((value) => ({
    displayText: value,
    key,
    value,
  }));
}

/**
 * Builds a search chip for a text search field.
 * Returns an empty array if the value is blank or undefined.
 */
export function buildSearchChip({
  key,
  value,
}: {
  key: string;
  value: string | undefined;
}): FilterChip[] {
  const trimmed = value?.trim();
  if (!trimmed) return [];
  return [
    {
      displayText: `Search: ${trimmed}`,
      key,
      value: undefined,
    },
  ];
}

/**
 * Builds a year-range chip for a range slider filter.
 * Returns an empty array when the selected range equals the full available range.
 */
export function buildYearRangeChip({
  key,
  label,
  value,
}: {
  key: string;
  label: string;
  value: readonly [string, string] | undefined;
}): FilterChip[] {
  if (!value) return [];
  const [minYear, maxYear] = value;
  const range = minYear === maxYear ? minYear : `${minYear} to ${maxYear}`;
  return [
    {
      displayText: `${label}: ${range}`,
      key,
      value: undefined,
    },
  ];
}
