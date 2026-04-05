import { BarGradient } from "~/components/bar-gradient/BarGradient";
import { CoverListItemImageConfig } from "~/components/cover-list/CoverListItem";
import { CoverListItemCover } from "~/components/cover-list/CoverListItemCover";
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
          <ol className={`flex flex-col`}>
            {value.entries!.map((reading) => (
              <li
                className={`
                  group/list-item relative mb-1 flex w-full
                  max-w-(--breakpoint-desktop) transform-gpu flex-row gap-x-[5%]
                  bg-default px-container py-4 transition-transform duration-500
                  tablet-landscape:flex-col tablet-landscape:bg-transparent
                  tablet-landscape:p-6
                  desktop:p-7
                  ${
                    reading.slug
                      ? `
                        tablet:has-[a:hover]:-translate-y-2
                        tablet:has-[a:hover]:bg-default
                        tablet:has-[a:hover]:drop-shadow-2xl
                      `
                      : `bg-transparent`
                  }
                `}
                key={reading.sequence}
              >
                <CoverListItemCover
                  className={"tablet-landscape:w-auto"}
                  imageConfig={CoverListItemImageConfig}
                  imageProps={reading.coverImageProps}
                />
                <div
                  className={`
                    flex grow flex-col items-start gap-y-2
                    tablet:mt-2 tablet:w-full tablet:gap-y-1 tablet:px-1
                  `}
                >
                  <ListItemTitle slug={reading.slug} title={reading.title} />
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
              </li>
            ))}
          </ol>
        </div>
      )}
    </td>
  );
}

function Abandoned({ className }: { className?: string }): React.JSX.Element {
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
