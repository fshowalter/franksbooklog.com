import { CoverList } from "~/components/react/cover-list/CoverList";

import type { ShowMoreAction } from "./paginationReducer";

import { createShowMoreAction } from "./paginationReducer";

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
    <div
      className="
        tablet:-mx-6 tablet:pt-5
        desktop:-mx-8
      "
    >
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
