/**
 * Renders the kind (type) and year information for a list item.
 * Displays both values in a pipe-separated format with subtle styling.
 *
 * @param props - The component props
 * @param props.kind - The type/kind of work (e.g., "Novel", "Short Story", etc.)
 * @param props.year - The publication or release year
 * @returns A JSX element containing the formatted kind and year information
 */
export function ListItemKindAndYear({
  kind,
  year,
}: {
  kind: string;
  year: string;
}): React.JSX.Element {
  return (
    <div className={`font-sans text-[13px]/4 tracking-prose text-subtle`}>
      <span>{kind} | </span>
      {year}
    </div>
  );
}
