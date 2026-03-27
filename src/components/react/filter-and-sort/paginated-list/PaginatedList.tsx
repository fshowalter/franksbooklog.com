import type { ShowMoreAction } from "./paginationReducer";

import { createShowMoreAction } from "./paginationReducer";

export function PaginatedList({
  children,
  dispatch,
  totalCount,
  visibleCount,
}: {
  children: React.ReactNode;
  dispatch: React.Dispatch<ShowMoreAction>;
  totalCount: number;
  visibleCount: number;
}): React.JSX.Element {
  return (
    <div
      className="
        tablet:-mx-6 tablet:pt-5
        desktop:-mx-8
      "
    >
      {children}
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
