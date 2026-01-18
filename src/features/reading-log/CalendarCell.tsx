import { BarGradient } from "~/components/bar-gradient/BarGradient";
import { CoverListItem } from "~/components/cover-list/CoverListItem";
import { ListItemAuthors } from "~/components/list-item-authors/ListItemAuthors";
import { ListItemTitle } from "~/components/list-item-title/ListItemTitle";

import type { CalendarCellData } from "./useCalendar";

/**
 * Renders a single calendar cell for the reading log.
 * Displays the date and any reading entries for that day.
 * @param props - Component props
 * @param props.value - Calendar cell data including date and reading entries
 * @returns Calendar cell component
 */
export function CalendarCell({
  value,
}: {
  value: CalendarCellData;
}): React.JSX.Element {
  if (!value.date) {
    return (
      <td
        className={`
          hidden min-h-[100px] border border-default bg-transparent p-2
          align-top
          tablet-landscape:table-cell
        `}
      />
    );
  }

  const dayOfWeek = value.dayOfWeek!; // Always defined for days with dates
  const hasEntries = Boolean(value.entries && value.entries.length > 0);

  return (
    <td
      className={`
        min-h-[100px] w-full border-default bg-calendar align-top
        tablet:border tablet:px-2
        tablet-landscape:mb-0 tablet-landscape:table-cell
        tablet-landscape:w-[14.28%] tablet-landscape:py-2
        ${hasEntries ? "block" : `hidden`}
      `}
      data-weekday={dayOfWeek}
    >
      <div
        className={`
          mb-1 px-container py-2 text-sm font-medium
          tablet:px-6 tablet:text-xl tablet:font-normal
          tablet-landscape:py-0
          ${hasEntries ? "text-default" : "text-muted"}
        `}
      >
        <span
          className={`
            mr-2 font-sans text-xs font-light text-subtle uppercase
            tablet-landscape:hidden
          `}
        >
          {dayOfWeek}
        </span>
        {value.date}
      </div>
      {hasEntries && (
        <div className="@container/cover-list">
          <ol
            className={`
              flex flex-col [--cover-list-item-width:33.33%]
              tablet:flex-row tablet:flex-wrap tablet:items-baseline
              tablet-landscape:flex-col
              tablet-landscape:[--cover-list-item-width:100%]
              @min-[calc((250px*3)+1px)]/cover-list:[--cover-list-item-width:25%]
            `}
          >
            {value.entries!.map((reading) => (
              <CoverListItem
                className={`items-center`}
                coverImageProps={reading.coverImageProps}
                key={reading.entrySequence}
              >
                <div
                  className={`
                    flex grow flex-col items-start gap-y-2
                    tablet:mt-2 tablet:w-full tablet:gap-y-1 tablet:px-1
                  `}
                >
                  <ListItemTitle
                    slug={reading.reviewed ? reading.slug : undefined}
                    title={reading.title}
                  />
                  <ListItemAuthors values={reading.authors} />
                  <div
                    className={`
                      font-sans text-xs/4 font-normal tracking-prose text-subtle
                    `}
                  >
                    {reading.edition}
                  </div>
                  {reading.progress === "Abandoned" ? (
                    <Abandoned className="mt-1" />
                  ) : (
                    <div
                      className={`
                        grid grid-cols-[1fr_auto] items-center self-stretch
                      `}
                    >
                      <div className="flex h-[6px] flex-col bg-subtle">
                        <BarGradient
                          maxValue={100}
                          value={parseProgress(reading.progress)}
                        />
                      </div>
                      <span className="pl-4 font-sans text-xs text-subtle">
                        {reading.progress}
                      </span>
                    </div>
                  )}
                </div>
              </CoverListItem>
            ))}
          </ol>
        </div>
      )}
    </td>
  );
}

function Abandoned({
  className,
}: {
  className?: string;
}): false | React.JSX.Element {
  return (
    <div
      className={`
        rounded-sm bg-abandoned px-2 py-1 font-sans text-xxs font-bold
        tracking-prose text-inverse uppercase
        ${className}
      `}
    >
      Abandoned
    </div>
  );
}

function parseProgress(progress: string): number {
  const progressNumber = progress.split("%", 1)[0];

  if (progressNumber === "Finished") {
    return 100;
  }

  if (!Number.isNaN(Number(progressNumber))) {
    return Number.parseInt(progressNumber);
  }

  return 100;
}
