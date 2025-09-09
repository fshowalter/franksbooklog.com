/**
 * Mapping of letter grades to their HTML entity star representations.
 * Used for generating text-based star ratings using Unicode star symbols
 * and fraction characters for half-star ratings.
 */
const gradeMap: Record<string, string> = {
  A: "&#9733;&#9733;&#9733;&#9733;&#9733;",
  "A+": "&#9733;&#9733;&#9733;&#9733;&#9733;",
  "A-": "&#9733;&#9733;&#9733;&#9733;&#189;",
  B: "&#9733;&#9733;&#9733;&#9733;",
  "B+": "&#9733;&#9733;&#9733;&#9733;",
  "B-": "&#9733;&#9733;&#9733;&#189;",
  C: "&#9733;&#9733;&#9733;",
  "C+": "&#9733;&#9733;&#9733;",
  "C-": "&#9733;&#9733;&#189;",
  D: "&#9733;&#9733;",
  "D+": "&#9733;&#9733;",
  "D-": "&#9733;&#189;",
  F: "&#9733;",
};

/**
 * Converts a letter grade to its HTML entity star representation.
 * Returns a string of HTML entities representing stars for the given grade.
 * 
 * @param grade - The letter grade (e.g., "A+", "B-", "C", etc.)
 * @returns HTML entity string representing the star rating
 */
export function textStarsForGrade(grade: string) {
  return gradeMap[grade];
}
