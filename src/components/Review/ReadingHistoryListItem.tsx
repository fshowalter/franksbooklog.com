import type { ReviewWithContent } from "src/api/reviews";
import { BarGradient } from "src/components/BarGradient";
import { DateIcon } from "src/components/DateIcon";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const progressDateFormat = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

interface Props {
  value: ReviewWithContent["readings"][0];
}

export function ReadingHistoryListItem({ value }: Props) {
  return (
    <li className="grid auto-rows-auto grid-cols-[16px_16px_1fr] pt-4 font-sans text-xs even:bg-subtle">
      <DateIcon />{" "}
      <div className="col-start-3">
        <Date value={value.date} />
        <Edition value={value.edition} />{" "}
        <EditionNotes value={value.editionNotes} />
      </div>
      <div className="col-start-3 row-start-2">
        <Details value={value} />
      </div>
      <div className="col-span-3 col-start-1 row-start-3 pt-4">
        <ReadingNotes value={value.readingNotes} />
      </div>
    </li>
  );
}

function Date({ value }: { value: ReviewWithContent["readings"][0]["date"] }) {
  return (
    <>
      <span className="inline-block font-sans text-xs font-normal tracking-normal text-subtle">
        {dateFormat.format(value)}
      </span>{" "}
    </>
  );
}

function Edition({
  value,
}: {
  value: ReviewWithContent["readings"][0]["edition"];
}) {
  return (
    <span className="text-subtle">
      <span>via</span>{" "}
      <span className="font-sans text-xs font-normal text-subtle">{value}</span>
    </span>
  );
}

function EditionNotes({
  value,
}: {
  value: ReviewWithContent["readings"][0]["editionNotes"];
}) {
  if (!value) {
    return null;
  }
  return (
    <span className="font-light tracking-normal text-subtle">
      (
      <RenderedMarkdown
        // eslint-disable-next-line react/no-danger
        text={value}
        className="leading-none"
        as="span"
      />
      )
    </span>
  );
}

function Details({ value }: { value: ReviewWithContent["readings"][0] }) {
  if (value.readingTime === 1) {
    return null;
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
        <span className="font-normal text-subtle">
          {value.readingTime} Days
        </span>
      </summary>
      <ol className="grid w-full grid-cols-[auto,1fr,auto]">
        {value.timeline.map((entry) => {
          let progressValue = null;
          const progressNumber = entry.progress.split("%", 1)[0];

          if (progressNumber === "Finished") {
            progressValue = 100;
          }

          if (!isNaN(Number(progressNumber))) {
            progressValue = parseInt(progressNumber);
          }

          const entryDate = progressDateFormat.format(entry.date);

          return (
            <li
              key={entryDate}
              className="relative col-span-3 grid grid-cols-subgrid grid-rows-[1fr,auto,auto,1fr] py-3"
            >
              <div className="col-span-2 col-start-2 row-start-2 grid grid-cols-subgrid">
                <div className="">{entryDate}</div>
                <div className="col-start-3 self-center text-nowrap pb-1 text-right font-sans text-xs text-subtle">
                  <div className="">{entry.progress}</div>
                </div>
              </div>
              <div className="col-span-2 col-start-2 row-start-3 bg-subtle">
                {progressValue && (
                  <BarGradient value={progressValue} maxValue={100} />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </details>
  );
}

function ReadingNotes({
  value,
}: {
  value: ReviewWithContent["readings"][0]["readingNotes"];
}) {
  if (!value) {
    return null;
  }
  return (
    <div className="pb-6 text-sm font-light">
      <RenderedMarkdown
        className="leading-normal text-muted"
        // eslint-disable-next-line react/no-danger
        text={value}
      />
    </div>
  );
}
