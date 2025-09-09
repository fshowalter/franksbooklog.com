import { gradeMap } from "./gradeMap";

/**
 * Gets the SVG file path for a given grade value.
 * Returns the appropriate star rating SVG file path from the grade map.
 * Returns undefined for invalid grades or "Abandoned" status.
 *
 * @param value - The grade value (e.g., "A+", "B-", "C", etc.)
 * @returns The SVG file path for the grade, or undefined if not found or abandoned
 */
export function fileForGrade(value: string): string | undefined {
  if (!value || value == "Abandoned") {
    return;
  }

  const [src] = gradeMap[value];

  return src;
}
