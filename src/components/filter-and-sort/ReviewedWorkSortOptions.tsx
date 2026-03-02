import type { SortOption } from "./FilterAndSortContainer";

/**
 * Sort options for reviewed work lists (title, grade, work year, review date).
 */
export const REVIEWED_WORK_SORT_OPTIONS: readonly SortOption[] = [
  { label: "Title (A \u2192 Z)", value: "title-asc" },
  { label: "Title (Z \u2192 A)", value: "title-desc" },
  { label: "Grade (Best First)", value: "grade-desc" },
  { label: "Grade (Worst First)", value: "grade-asc" },
  { label: "Work Year (Newest First)", value: "work-year-desc" },
  { label: "Work Year (Oldest First)", value: "work-year-asc" },
  { label: "Review Date (Newest First)", value: "review-date-desc" },
  { label: "Review Date (Oldest First)", value: "review-date-asc" },
] as const;
