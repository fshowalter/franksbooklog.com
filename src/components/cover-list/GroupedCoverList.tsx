import { GroupingListItem } from "~/components/grouping-list-item/GroupingListItem";

import { CoverList } from "./CoverList";

/**
 * Renders a grouped cover list with optional "Show More" functionality.
 * Generic component that organizes covers into groups with headers and provides
 * pagination through a "Show More" button when there are more items to display.
 * 
 * @template T - The type of items being rendered
 * @param props - The component props
 * @param props.children - Function that renders each individual item
 * @param props.groupedValues - Map of group names to their respective items
 * @param props.groupItemClassName - Optional CSS class for group item containers
 * @param props.onShowMore - Optional callback for "Show More" button clicks
 * @param props.totalCount - Total number of items available
 * @param props.visibleCount - Number of items currently visible
 * @param props.rest - Additional props passed to the root element
 * @returns A JSX element containing the grouped cover list with optional pagination
 */
export function GroupedCoverList<T>({
  children,
  groupedValues,
  groupItemClassName,
  onShowMore,
  totalCount,
  visibleCount,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  groupedValues: Map<string, Iterable<T>>;
  groupItemClassName?: string;
  onShowMore?: () => void;
  totalCount: number;
  visibleCount: number;
}): React.JSX.Element {
  return (
    <>
      <ol data-testid="grouped-cover-list" {...rest}>
        {[...groupedValues].map((groupedValue) => {
          const [group, groupValues] = groupedValue;
          return (
            <GroupingListItem
              className={groupItemClassName}
              groupText={group}
              key={group}
            >
              {" "}
              <div className="tablet:-mx-6">
                <CoverList>
                  {[...groupValues].map((value) => children(value))}
                </CoverList>
              </div>
            </GroupingListItem>
          );
        })}
      </ol>
      {onShowMore && (
        <div className="flex flex-col items-center px-container py-10">
          {totalCount > visibleCount && (
            <button
              className={`
                mx-auto w-full max-w-button bg-canvas py-5 text-center font-sans
                text-xs font-semibold tracking-wide uppercase shadow-all
                hover:bg-footer hover:text-inverse
              `}
              onClick={onShowMore}
              type="button"
            >
              Show More
            </button>
          )}
        </div>
      )}
    </>
  );
}
