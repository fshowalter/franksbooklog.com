import { Button } from "./Button";

export function GroupedList<T>({
  groupedValues,
  visibleCount,
  totalCount,
  onShowMore,
  children,
  className,
  ...rest
}: {
  groupedValues: Map<string, Iterable<T>>;
  visibleCount: number;
  totalCount: number;
  onShowMore: () => void;
  children: (item: T) => React.ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <>
      <ol className={className} {...rest}>
        {[...groupedValues].map((groupedValue, index) => {
          const [group, groupValues] = groupedValue;

          return (
            <GroupingListItem groupText={group} key={group} zIndex={index + 1}>
              <ol>{[...groupValues].map(children)}</ol>
            </GroupingListItem>
          );
        })}
      </ol>
      <div className="flex flex-col items-center px-container py-10">
        {totalCount > visibleCount && (
          <Button onClick={onShowMore}>Show More</Button>
        )}
      </div>
    </>
  );
}

function GroupingListItem({
  groupText,
  children,
  zIndex,
}: {
  groupText: string;
  children: React.ReactNode;
  zIndex: number;
}) {
  return (
    <li className="block">
      <div style={{ zIndex: zIndex }} className="pt-0 text-md">
        <div className="mb-1 max-w-screen-max bg-subtle px-container py-8 text-xl leading-8 tablet:px-4">
          {groupText}
        </div>
      </div>
      <div className="bg-subtle">{children}</div>
    </li>
  );
}
