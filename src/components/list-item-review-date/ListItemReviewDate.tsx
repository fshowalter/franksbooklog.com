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
