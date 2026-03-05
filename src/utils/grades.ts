// AIDEV-NOTE: Single source of truth for grade number <-> letter mapping
// Used by GradeField, filter chip displays, and API layers across the site.
// Scale: 2 (F-) to 16 (A+). Abandoned entries use gradeValue=0 (below slider range).

export const GRADE_MIN = 2;
export const GRADE_MAX = 16;

export const GRADE_TO_SVG_FILE_AND_ALT: Record<string, [string, string]> = {
  A: ["/svg/5-stars.svg", "5 stars (out of 5)"],
  "A+": ["/svg/5-stars.svg", "5 stars (out of 5)"],
  "A-": ["/svg/4-half-stars.svg", "4.5 stars (out of 5)"],
  B: ["/svg/4-stars.svg", "4 stars (out of 5)"],
  "B+": ["/svg/4-stars.svg", "4 stars (out of 5)"],
  "B-": ["/svg/3-half-stars.svg", "3.5 stars (out of 5)"],
  C: ["/svg/3-stars.svg", "3 stars (out of 5)"],
  "C+": ["/svg/3-stars.svg", "3 stars (out of 5)"],
  "C-": ["/svg/2-half-stars.svg", "2.5 stars (out of 5)"],
  D: ["/svg/2-stars.svg", "2 stars (out of 5)"],
  "D+": ["/svg/2-stars.svg", "2 stars (out of 5)"],
  "D-": ["/svg/1-half-stars.svg", "1.5 stars (out of 5)"],
  F: ["/svg/1-star.svg", "1 star (out of 5)"],
};

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
