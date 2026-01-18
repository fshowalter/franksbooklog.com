/**
 * Renders a grouped list item with a header section and content area.
 * Creates a sectioned list item with a distinctive header displaying the group text
 * and a content area for child elements. Includes responsive styling and proper
 * accessibility with an ID matching the group text.
 *
 * @param props - The component props
 * @param props.children - The content to render within the group's content area
 * @param props.className - Optional additional CSS classes to apply to the list item
 * @param props.groupText - The text to display in the group header and use as the element ID
 * @returns A JSX element containing the grouped list item structure
 */
export function GroupingListItem({
  children,
  className,
  groupText,
}: {
  children: React.ReactNode;
  className?: string;
  groupText: string;
}): React.JSX.Element {
  return (
    <li
      className={`
        block
        first-of-type:mt-4
        ${className ?? ""}
      `}
      id={groupText}
    >
      <div className={`pt-0 text-md`}>
        <div
          className={`
            max-w-(--breakpoint-desktop) bg-subtle px-container py-4 text-xl/8
            tablet:px-1
          `}
        >
          {groupText}
        </div>
      </div>
      <div className="bg-subtle">{children}</div>
    </li>
  );
}
