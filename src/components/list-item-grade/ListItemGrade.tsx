import type { GradeText } from "~/utils/grades";

import { Grade } from "~/components/grade/Grade";

export function ListItemGrade({
  grade,
}: {
  grade: GradeText;
}): React.JSX.Element {
  return grade === "Abandoned" ? (
    <div
      className={`
        rounded-sm bg-abandoned px-2 py-1 font-sans text-xxs font-bold
        tracking-prose text-inverse uppercase
      `}
    >
      Abandoned
    </div>
  ) : (
    <Grade className="-mb-0.5 pb-[3px]" height={15} value={grade} />
  );
}
