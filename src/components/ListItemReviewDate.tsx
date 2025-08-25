export function ListItemReviewDate({ displayDate }: { displayDate: string }) {
  return (
    <div
      className={`font-sans text-[13px] leading-4 tracking-prose text-subtle`}
    >
      {displayDate}
    </div>
  );
}
