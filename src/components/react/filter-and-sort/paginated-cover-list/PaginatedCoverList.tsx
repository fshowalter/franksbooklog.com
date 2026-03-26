import { CoverList } from "~/components/react/cover-list/CoverList";

import type { ShowMoreAction } from "./paginationReducer";

import { createShowMoreAction } from "./paginationReducer";

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
export function PaginatedCoverList<T>({
  children,
  dispatch,
  totalCount,
  values,
  visibleCount,
  ...rest
}: {
  children: (item: T) => React.ReactNode;
  dispatch: React.Dispatch<ShowMoreAction>;
  totalCount: number;
  values: Iterable<T>;
  visibleCount: number;
}): React.JSX.Element {
  return (
    <div className="tablet:-mx-6 tablet:pt-5">
      <CoverList {...rest}>
        {[...values].map((value) => children(value))}
      </CoverList>
      <div className="flex flex-col items-center px-container py-10">
        {totalCount > visibleCount && (
          <button
            className={`
              mx-auto w-full max-w-button bg-canvas py-5 text-center font-sans
              text-xs font-semibold tracking-wide uppercase shadow-all
              hover:bg-footer hover:text-inverse
            `}
            onClick={(): void => dispatch(createShowMoreAction())}
            type="button"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
