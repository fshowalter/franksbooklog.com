import type { ReadingLogAction } from "./ReadingLog.reducer";

import {
  createNextMonthClickedAction,
  createPreviousMonthClickedAction,
} from "./ReadingLog.reducer";

/**
 * Header component for calendar month navigation.
 * @param props - Component props
 * @param props.currentMonthDate - Date string for the currently displayed month
 * @param props.dispatch - Reducer dispatch function for navigation actions
 * @param props.nextMonthDate - Date string for the next available month
 * @param props.prevMonthDate - Date string for the previous available month
 * @returns Navigation header with month display and prev/next buttons
 */
export function MonthNavigationHeader({
  currentMonthDate,
  dispatch,
  nextMonthDate,
  prevMonthDate,
}: {
  currentMonthDate: string;
  dispatch: React.Dispatch<ReadingLogAction>;
  nextMonthDate: string | undefined;
  prevMonthDate: string | undefined;
}): React.JSX.Element {
  const monthName = new Date(currentMonthDate).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  });

  const prevMonthName = prevMonthDate
    ? new Date(prevMonthDate).toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  const nextMonthName = nextMonthDate
    ? new Date(nextMonthDate).toLocaleString("en-US", {
        month: "short",
        timeZone: "UTC",
        year: "numeric",
      })
    : "";

  return (
    <div
      className={`
        sticky top-(--list-scroll-offset) z-sticky flex
        max-w-(--breakpoint-desktop) items-center justify-between border-b
        border-default bg-subtle px-container py-4
        tablet:-mx-(--container-padding) tablet:py-6
        tablet-landscape:py-8
        desktop:mx-0 desktop:px-0
      `}
    >
      <div className="w-1/3">
        {prevMonthDate && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to previous month: ${prevMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-[13px]
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-right after:scale-x-0 after:bg-accent
              after:transition-transform after:duration-500
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() =>
              dispatch(createPreviousMonthClickedAction(prevMonthDate))
            }
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
        {nextMonthDate && (
          <button
            aria-disabled={false}
            aria-label={`Navigate to next month: ${nextMonthName}`}
            className={`
              -mb-1 transform-gpu cursor-pointer pb-1 font-sans text-[13px]
              font-bold text-accent transition-transform
              after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
              after:origin-bottom-left after:scale-x-0 after:bg-accent
              after:transition-transform after:duration-500
              hover:after:scale-x-100
              tablet-landscape:tracking-wide tablet-landscape:uppercase
            `}
            onClick={() =>
              dispatch(createNextMonthClickedAction(nextMonthDate))
            }
            type="button"
          >
            {nextMonthName} →
          </button>
        )}
      </div>
    </div>
  );
}
