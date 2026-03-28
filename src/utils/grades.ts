// Single source of truth for grade number <-> letter mapping
// Used by GradeField, filter chip displays, and API layers across the site.
// Scale: 2 (F-) to 16 (A+). Abandoned entries use gradeValue=0 (below slider range).

export const GRADES = [
  "A",
  "A+",
  "A-",
  "Abandoned",
  "B",
  "B+",
  "B-",
  "C",
  "C+",
  "C-",
  "D",
  "D+",
  "D-",
  "F",
  "F+",
  "F-",
] as const;

export type GradeText = (typeof GRADES)[number];

export const GRADE_VALUES = [
  0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
] as const;

export const GRADE_MIN: GradeValue = 2;
export const GRADE_MAX: GradeValue = 16;

export type GradeValue = (typeof GRADE_VALUES)[number];

export const GRADE_VALUE_TO_LETTER: Record<GradeValue, GradeText> = {
  0: "Abandoned",
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
} as const;

const GRADE_TEXT_TO_VALUE: Record<GradeText, GradeValue> = {
  A: 15,
  "A+": 16,
  "A-": 14,
  Abandoned: 0,
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
} as const;

export function gradeToValue(grade: GradeText): GradeValue {
  return GRADE_TEXT_TO_VALUE[grade];
}

export function gradeValueToLetter(gradeValue: GradeValue): GradeText {
  return GRADE_VALUE_TO_LETTER[gradeValue];
}

export const GRADE_SVG_MAP: Record<
  Exclude<GradeText, "Abandoned">,
  { altText: string; src: string }
> = {
  A: { altText: "5 stars (out of 5)", src: "/svg/5-stars.svg" },
  "A+": { altText: "5 stars (out of 5)", src: "/svg/5-stars.svg" },
  "A-": { altText: "4.5 stars (out of 5)", src: "/svg/4-half-stars.svg" },
  B: { altText: "4 stars (out of 5)", src: "/svg/4-stars.svg" },
  "B+": { altText: "4 stars (out of 5)", src: "/svg/4-stars.svg" },
  "B-": { altText: "3.5 stars (out of 5)", src: "/svg/3-half-stars.svg" },
  C: { altText: "3 stars (out of 5)", src: "/svg/3-stars.svg" },
  "C+": { altText: "3 stars (out of 5)", src: "/svg/3-stars.svg" },
  "C-": { altText: "2.5 stars (out of 5)", src: "/svg/2-half-stars.svg" },
  D: { altText: "2 stars (out of 5)", src: "/svg/2-stars.svg" },
  "D+": { altText: "2 stars (out of 5)", src: "/svg/2-stars.svg" },
  "D-": { altText: "1.5 stars (out of 5)", src: "/svg/1-half-stars.svg" },
  F: { altText: "1 star (out of 5)", src: "/svg/1-star.svg" },
  "F+": { altText: "1 star (out of 5)", src: "/svg/1-star.svg" },
  "F-": { altText: "1/2 star (out of 5)", src: "/svg/half-star.svg" },
} as const;
