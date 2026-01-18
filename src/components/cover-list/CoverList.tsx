/**
 * Renders a responsive grid layout for cover items.
 * Uses container queries to adjust the number of columns based on available width,
 * ensuring covers maintain their minimum width of 250px. Automatically adjusts
 * from 2 columns up to 6 columns as space permits.
 *
 * @param props - The component props
 * @param props.children - The cover list items to render within the grid
 * @param props.className - Optional additional CSS classes to apply
 * @returns A JSX element containing the responsive cover grid layout
 */
export function CoverList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <div className="@container/cover-list">
      {/* AIDEV-NOTE: The 250px values below cannot be extracted to a constant/variable
          because Tailwind's utility class system requires literal values at build time.
          Tailwind scans the codebase for class names and generates CSS only for the 
          classes it finds. Using dynamic values or variables would break this process
          and the styles wouldn't be generated. The repeated 250px represents the 
          minimum cover width for responsive breakpoints. */}
      <ol
        className={`
          items-baseline [--cover-list-item-width:50%]
          tablet:flex tablet:flex-wrap
          @min-[calc((250px*2)+1px)]/cover-list:[--cover-list-item-width:33.33%]
          @min-[calc((250px*3)+1px)]/cover-list:[--cover-list-item-width:25%]
          @min-[calc((250px*4)+1px)]/cover-list:[--cover-list-item-width:20%]
          @min-[calc((250px*5)+1px)]/cover-list:[--cover-list-item-width:16.66%]
          ${className}
        `}
      >
        {children}
      </ol>
    </div>
  );
}
