/**
 * Container component for list item details section.
 * Provides consistent layout and spacing for list item content with responsive
 * design that adapts to tablet and larger screens.
 * 
 * @param props - The component props
 * @param props.children - The content to render within the details container
 * @returns A JSX element containing the styled details container
 */
export function ListItemDetails({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex grow flex-col items-start gap-y-2
        tablet:mt-2 tablet:w-full tablet:px-1
      `}
    >
      {children}
    </div>
  );
}
