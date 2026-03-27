// Single source of truth for grade number <-> letter mapping
// Used by GradeField, filter chip displays, and API layers across the site.
// Scale: 2 (F-) to 16 (A+). Abandoned entries use gradeValue=0 (below slider range).

export const GRADE_MIN = 2;
export const GRADE_MAX = 16;
export const GRADES = <const>[
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F+",
  "F",
  "F-",
  "Abandoned",
];

export type GradeType = (typeof GRADES)[number];
export type GradeValueType = keyof typeof GRADE_TO_LETTER;

export const GRADE_TO_LETTER = {
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

export const GRADE_TO_VALUE = {
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

export function gradeToLetter(value: keyof typeof GRADE_TO_LETTER): string {
  return GRADE_TO_LETTER[value];
}

export function gradeToValue(grade: (typeof GRADES)[number]): GradeValueType {
  return GRADE_TO_VALUE[grade]; // Abandoned and unknown → 0
}
