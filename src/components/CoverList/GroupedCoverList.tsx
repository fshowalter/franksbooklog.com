import { GroupingListItem } from "~/components/GroupingListItem/GroupingListItem";

import { CoverList } from "./CoverList";

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
