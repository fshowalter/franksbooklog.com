import { Grade } from "~/components/grade/Grade";

/**
 * Renders a grade display for a list item, with special handling for "Abandoned" items.
 * For abandoned items, displays a distinctive badge. For all other grades, renders
 * the grade using the Grade component with star visualization.
 *
 * @param props - The component props
 * @param props.grade - The grade value to display (e.g., "A+", "B-", "Abandoned", etc.)
 * @returns A JSX element containing either an "Abandoned" badge or a Grade component
 */
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
