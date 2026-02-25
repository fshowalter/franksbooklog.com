// AIDEV-NOTE: Single source of truth for grade number <-> letter mapping
// Used by GradeField, filter chip displays, and API layers across the site.
// Scale: 2 (F-) to 16 (A+). Abandoned entries use gradeValue=0 (below slider range).

export const GRADE_MIN = 2;
export const GRADE_MAX = 16;

const GRADE_TO_LETTER: Record<number, string> = {
  2: "F-",
  3: "F",
  4: "F+",
  5: "D-",
  6: "D",
  7: "D+",
  8: "C-",
  9: "C",
  10: "C+",
  11: "B-",
  12: "B",
  13: "B+",
  14: "A-",
  15: "A",
  16: "A+",
};

const GRADE_TO_VALUE: Record<string, number> = {
  A: 15,
  "A+": 16,
  "A-": 14,
  B: 12,
  "B+": 13,
  "B-": 11,
  C: 9,
  "C+": 10,
  "C-": 8,
  D: 6,
  "D+": 7,
  "D-": 5,
  F: 3,
  "F+": 4,
  "F-": 2,
};

/**
 * Maps a grade number (2-16) to its letter grade (F- to A+).
 * @param value - Grade as a number (2-16)
 * @returns Letter grade (e.g., "A+", "B-", "F")
 */
export function gradeToLetter(value: number): string {
  return GRADE_TO_LETTER[value] ?? String(value);
}

/**
 * Maps a letter grade to its numeric value (2-16).
 * Abandoned and unknown grades return 0 (below the slider range).
 * @param grade - Letter grade (e.g., "A+", "B-", "F", "Abandoned")
 * @returns Numeric grade value (2-16), or 0 for Abandoned/unknown
 */
export function gradeToValue(grade: string): number {
  return GRADE_TO_VALUE[grade] ?? 0; // Abandoned and unknown → 0
}
