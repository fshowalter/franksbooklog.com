import { Grade } from "~/components/Grade/Grade";

export function ListItemGrade({ grade }: { grade: string }): React.JSX.Element {
  if (grade === "Abandoned") {
    return (
      <div
        className={`
          rounded-sm bg-abandoned px-2 py-1 font-sans text-xxs font-bold
          tracking-prose text-inverse uppercase
        `}
      >
        Abandoned
      </div>
    );
  }
  return <Grade className="-mb-0.5 pb-[3px]" height={15} value={grade} />;
}
