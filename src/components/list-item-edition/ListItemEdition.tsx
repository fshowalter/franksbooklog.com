/**
 * Renders edition information for a list item.
 * Displays edition details in a small, subtle text style appropriate for
 * secondary metadata in lists.
 *
 * @param props - The component props
 * @param props.value - The edition information to display (e.g., "First Edition", "Paperback", etc.)
 * @returns A JSX element containing the styled edition information
 */
export function ListItemEdition({
  value,
}: {
  value: string;
}): React.JSX.Element {
  return (
    <div className={`font-sans text-xs/4 tracking-prose text-subtle`}>
      {value}
    </div>
  );
}
