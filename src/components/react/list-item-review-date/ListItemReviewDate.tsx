/**
 * Renders a formatted review date for a list item.
 * Displays the date in a subtle, secondary text style suitable for list item metadata.
 *
 * @param props - The component props
 * @param props.displayDate - The formatted date string to display
 * @returns A JSX element containing the styled review date
 */
export function ListItemReviewDate({
  displayDate,
}: {
  displayDate: string;
}): React.JSX.Element {
  return (
    <div className={`font-sans text-[13px]/4 tracking-prose text-subtle`}>
      {displayDate}
    </div>
  );
}
