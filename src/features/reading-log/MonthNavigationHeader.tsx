import {
  createNextMonthAction,
  createPreviousMonthAction,
  type ReadingsActionType,
} from "./ReadingLog.reducer";

type MonthNavHeaderProps = {
  currentMonth: Date;
  dispatch: React.Dispatch<ReadingsActionType>;
  hasNextMonth: boolean;
  hasPrevMonth: boolean;
  nextMonth: Date | undefined;
  prevMonth: Date | undefined;
};

export function MonthNavHeader({
  currentMonth,
  dispatch,
  hasNextMonth,
  hasPrevMonth,
  nextMonth,
  prevMonth,
}: MonthNavHeaderProps): React.JSX.Element {
  const monthName = currentMonth.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });

  const prevMonthName = prevMonth
    ? prevMonth.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  const nextMonthName = nextMonth
    ? nextMonth.toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={`
        sticky top-(--filter-and-sort-container-scroll-offset) z-sticky flex
        max-w-(--breakpoint-desktop) items-center justify-between border-b
        border-default bg-subtle px-container py-4
        tablet:-mx-(--container-padding) tablet:py-6
        tablet-landscape:py-8
        desktop:-mx-0 desktop:px-0
      `}
    >
      <div className="w-1/3">
        {hasPrevMonth && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to previous month: ${prevMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-[13px]
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-right after:scale-x-0
              after:bg-(--color-accent) after:transition-transform
              after:duration-500
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() => dispatch(createPreviousMonthAction())}
            type="button"
          >
            ← {prevMonthName}
          </button>
        )}
      </div>
      <h2
        className={`
          w-1/3 text-center text-base font-medium
          tablet:text-lg
          tablet-landscape:text-xl
        `}
      >
        {monthName}
      </h2>
      <div className="w-1/3 text-right">
        {hasNextMonth && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to next month: ${nextMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-[13px]
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-left after:scale-x-0 after:bg-(--color-accent)
              after:transition-transform after:duration-500
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() => dispatch(createNextMonthAction())}
            type="button"
          >
            {nextMonthName} →
          </button>
        )}
      </div>
    </div>
  );
}
