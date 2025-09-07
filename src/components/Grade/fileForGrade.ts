import { gradeMap } from "./gradeMap";

export function fileForGrade(value: string): string | undefined {
  if (!value || value == "Abandoned") {
    return;
  }

  const [src] = gradeMap[value];

  return src;
}
