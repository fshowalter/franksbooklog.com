import { BarGradient } from "~/components/BarGradient/BarGradient";
import { CoverListItem } from "~/components/CoverList/CoverListItem";
import { ListItemAuthors } from "~/components/ListItemAuthors/ListItemAuthors";
import { ListItemTitle } from "~/components/ListItemTitle/ListItemTitle";

import type { CalendarWeek } from "./Readings.sorter";

export function CalendarDay({
  value,
}: {
  value: CalendarWeek[number];
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

  return (
    <td
      className={`
        min-h-[100px] w-full border-default bg-calendar align-top
        tablet:border tablet:px-2
        tablet-landscape:mb-0 tablet-landscape:table-cell
        tablet-landscape:w-[14.28%] tablet-landscape:py-2
        ${value.readings.length === 0 ? `hidden` : `block`}
      `}
      data-weekday={dayOfWeek}
    >
      <div
        className={`
          mb-1 px-container py-2 text-sm font-medium
          tablet:px-6 tablet:text-xl tablet:font-normal
          tablet-landscape:py-0
          ${value.readings.length > 0 ? "text-default" : "text-muted"}
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
      {value.readings.length > 0 && (
        <div className="@container/cover-list">
          <ol
            className={`
              flex flex-col
              [--cover-list-item-width:33.33%]
              tablet:flex-row tablet:flex-wrap tablet:items-baseline
              tablet-landscape:flex-col
              tablet-landscape:[--cover-list-item-width:100%]
              @min-[calc((250px_*_3)_+_1px)]/cover-list:[--cover-list-item-width:25%]
            `}
          >
            {value.readings.map((reading) => (
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
                      font-sans text-xs leading-4 font-normal tracking-prose
                      text-subtle
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
