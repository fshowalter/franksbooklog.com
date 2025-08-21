export function ListItemReviewDate({ displayDate }: { displayDate: string }) {
  return (
    <div
      className={`
        font-sans text-xs leading-4 font-light tracking-prose text-subtle
      `}
    >
      {displayDate}
    </div>
  );
}
