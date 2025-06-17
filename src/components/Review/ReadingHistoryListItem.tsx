import type { ReviewWithContent } from "~/api/reviews";

import { BarGradient } from "~/components/BarGradient";
import { RenderedMarkdown } from "~/components/RenderedMarkdown";

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const yearFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
});

const dayFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  timeZone: "UTC",
});

const weekdayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
});

const progressDateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

type Props = {
  value: ReviewWithContent["readings"][0];
};

export function ReadingHistoryListItem({ value }: Props) {
  return (
    <li className="mb-1 flex flex-col bg-subtle px-container font-sans text-xs font-light tablet:px-6">
      <div className="flex gap-x-4 py-4 tablet:gap-x-6">
        <div className="size-auto self-start">
          <Date date={value.date} />
        </div>
        <div className="mt-12 grow">
          <Edition value={value.edition} />
          <EditionNotes value={value.editionNotes} />
          <Details value={value} />
        </div>
      </div>
      <div>
        <ReadingNotes value={value.readingNotes} />
      </div>
    </li>
  );
}

function Date({ date }: { date: Date }) {
  return (
    <div className="bg-subtle py-2 text-center">
      <div className="px-4 pb-2 font-serif text-md font-normal text-subtle">
        {yearFormat.format(date)}
      </div>
      <div className="bg-default py-1 text-subtle">
        {monthFormat.format(date)}
      </div>
      <div className="bg-default font-serif text-md font-normal text-default">
        {dayFormat.format(date)}
      </div>
      <div className="bg-default py-1 text-subtle">
        {weekdayFormat.format(date)}
      </div>
    </div>
  );
}

function Details({ value }: { value: ReviewWithContent["readings"][0] }) {
  if (value.readingTime === 1) {
    return false;
  }

  const summaryText = value.abandoned
    ? "Abandoned after"
    : value.isAudiobook
      ? "Listened to over"
      : "Read over";

  return (
    <details className="font-light text-subtle">
      <summary className="cursor-pointer leading-6">
        {summaryText}{" "}
        <span className="text-accent">{value.readingTime} Days</span>
      </summary>
      <ol className="grid w-full grid-cols-[auto_1fr_auto] pt-3">
        {value.timeline.map((entry) => {
          let progressValue;
          const progressNumber = entry.progress.split("%", 1)[0];

          if (progressNumber === "Finished") {
            progressValue = 100;
          }

          if (!Number.isNaN(Number(progressNumber))) {
            progressValue = Number.parseInt(progressNumber);
          }

          const entryDate = progressDateFormat.format(entry.date);

          return (
            <li
              className="relative col-span-3 grid grid-cols-subgrid grid-rows-[1fr_auto_auto_1fr] py-1"
              key={entryDate}
            >
              <div className="col-span-2 col-start-2 row-start-2 grid grid-cols-subgrid font-sans text-xs">
                <div className="">{entryDate}</div>
                <div className="col-start-3 self-center text-nowrap pb-1 text-right font-sans text-xs">
                  <div className="">{entry.progress}</div>
                </div>
              </div>
              <div className="col-span-2 col-start-2 row-start-3 bg-stripe">
                {progressValue && (
                  <BarGradient maxValue={100} value={progressValue} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </details>
  );
}

function Edition({
  value,
}: {
  value: ReviewWithContent["readings"][0]["edition"];
}) {
  return (
    <span className="font-serif text-base font-normal text-default">
      {value}
    </span>
  );
}

function EditionNotes({
  value,
}: {
  value: ReviewWithContent["readings"][0]["editionNotes"];
}) {
  if (!value) {
    return false;
  }
  return (
    <span className="font-light tracking-normal text-subtle">
      {" "}
      (
      <RenderedMarkdown as="span" className="leading-none" text={value} />)
    </span>
  );
}

function ReadingNotes({
  value,
}: {
  value: ReviewWithContent["readings"][0]["readingNotes"];
}) {
  if (!value) {
    return false;
  }
  return (
    <div className="px-2 pb-6 text-sm font-light tablet:mx-24 tablet:px-0">
      <RenderedMarkdown
        className="leading-normal tracking-prose text-muted"
        text={value}
      />
    </div>
  );
}
