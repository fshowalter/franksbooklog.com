import type { CalendarWeek } from "./Readings.sorter";

import { CalendarDay } from "./CalendarDay";

export function CalendarMonth({
  weeks,
}: {
  weeks: CalendarWeek[];
}): React.JSX.Element {
  return (
    <div
      className={`
        scroll-mt-(--calendar-scroll-offset)
        [--calendar-scroll-offset:calc(var(--filter-and-sort-container-scroll-offset)_+_92px)]
        tablet:mt-8
        tablet-landscape:mt-16
      `}
      data-testid="calendar"
      id="calendar"
    >
      <table
        className={`
          w-full border-default
          tablet-landscape:border-collapse tablet-landscape:border
        `}
      >
        <thead
          className={`
            hidden transform-gpu bg-calendar
            tablet-landscape:sticky
            tablet-landscape:top-(--calendar-scroll-offset)
            tablet-landscape:z-sticky tablet-landscape:table-header-group
          `}
        >
          <tr className={`tablet-landscape:shadow-all`}>
            <WeekdayHeader>Sun</WeekdayHeader>
            <WeekdayHeader>Mon</WeekdayHeader>
            <WeekdayHeader>Tue</WeekdayHeader>
            <WeekdayHeader>Wed</WeekdayHeader>
            <WeekdayHeader>Thu</WeekdayHeader>
            <WeekdayHeader>Fri</WeekdayHeader>
            <WeekdayHeader>Sat</WeekdayHeader>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr className="tablet-landscape:table-row" key={weekIndex}>
              {week.map((day, dayIndex) => (
                <CalendarDay key={`${weekIndex}-${dayIndex}`} value={day} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WeekdayHeader({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <th
      className={`
        border-separate border border-default px-2 py-3 text-center font-sans
        text-sm font-normal tracking-wide text-subtle uppercase
      `}
    >
      {children}
    </th>
  );
}
