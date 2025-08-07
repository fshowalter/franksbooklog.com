import { type JSX, useReducer } from "react";

import type { BackdropImageProps } from "~/api/backdrops";
import type { CoverImageProps } from "~/api/covers";
import type { TimelineEntry } from "~/api/timelineEntries";

import { Backdrop } from "~/components/Backdrop";
import { BarGradient } from "~/components/BarGradient";
import { GroupedList } from "~/components/GroupedList";
import { ListItem } from "~/components/ListItem";
import { ListItemCover } from "~/components/ListItemCover";
import { ListItemKindAndYear } from "~/components/ListItemKindAndYear";
import { ListWithFiltersLayout } from "~/components/ListWithFiltersLayout";
import { ListHeaderButton } from "~/components/ListWithFiltersLayout";
import { toSentenceArray } from "~/utils";

import type { Sort } from "./Readings.reducer";

import { Filters } from "./Filters";
import { Actions, initState, reducer } from "./Readings.reducer";

export type ListItemValue = Pick<
  TimelineEntry,
  | "authors"
  | "edition"
  | "kind"
  | "progress"
  | "reviewed"
  | "slug"
  | "timelineSequence"
  | "title"
  | "yearPublished"
> & {
  coverImageProps: CoverImageProps;
  readingDate: string;
  readingDay: string;
  readingMonth: string;
  readingYear: string;
};
export type Props = {
  abandonedCount: number;
  backdropImageProps: BackdropImageProps;
  bookCount: number;
  deck: string;
  distinctEditions: string[];
  distinctKinds: string[];
  distinctReadingYears: string[];
  distinctWorkYears: string[];
  initialSort: Sort;
  shortStoryCount: number;
  values: ListItemValue[];
  workCount: number;
};

export function Readings({
  backdropImageProps,
  deck,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  initialSort,
  values,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      initialSort,
      values,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <Backdrop
          deck={deck}
          imageProps={backdropImageProps}
          title="Reading Log"
        />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctEditions={distinctEditions}
          distinctKinds={distinctKinds}
          distinctReadingYears={distinctReadingYears}
          distinctWorkYears={distinctWorkYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
          totalCount={state.filteredValues.length}
          visibleCount={state.showCount}
        >
          {(dateGroup) => {
            const [dayAndDate, values] = dateGroup;
            return (
              <DateListItem
                dayAndDate={dayAndDate}
                key={dayAndDate}
                values={values}
              />
            );
          }}
        </GroupedList>
      }
      listHeaderButtons={
        <ListHeaderButton href="/readings/stats/" text="stats" />
      }
      totalCount={state.filteredValues.length}
    />
  );
}

function Authors({
  className,
  values,
}: {
  className: string;
  values: ListItemValue["authors"];
}) {
  return (
    <div className={className}>
      {toSentenceArray(
        values.map((value) => (
          <span className="font-normal text-muted" key={value.name}>
            {value.name}
          </span>
        )),
      )}
    </div>
  );
}
function DateListItem({
  dayAndDate,
  values,
}: {
  dayAndDate: string;
  values: ListItemValue[];
}): JSX.Element {
  const [day, date] = dayAndDate.split("-");

  return (
    <li
      className={`
        relative flex max-w-(--breakpoint-desktop) flex-col bg-group
        last-of-type:pb-12
        tablet:mb-12 tablet:flex-row tablet:py-4 tablet:pr-4
        tablet:last-of-type:pb-4
      `}
    >
      <div
        className={`
          px-container py-4
          tablet:px-4 tablet:pt-11 tablet:text-muted
        `}
      >
        <div
          className={`
            flex items-center gap-1
            tablet:block
          `}
        >
          <div
            className={`
              text-center text-2xl text-muted
              tablet:text-2.5xl/8
            `}
          >
            {date}
          </div>
          <div
            className={`
              ml-1 py-2 font-sans text-xxs/none text-subtle uppercase
              tablet:ml-0 tablet:w-12 tablet:text-center
            `}
          >
            {day}
          </div>
        </div>
      </div>
      <ul
        className={`
          flex grow flex-col
          tablet:my-4 tablet:gap-y-0 tablet:bg-subtle
        `}
      >
        {values.map((value) => {
          return <ReadingListItem key={value.timelineSequence} value={value} />;
        })}
      </ul>
    </li>
  );
}

function parseProgress(progress: string) {
  const progressNumber = progress.split("%", 1)[0];

  if (progressNumber === "Finished") {
    return 100;
  }

  if (!Number.isNaN(Number(progressNumber))) {
    return Number.parseInt(progressNumber);
  }

  return 100;
}

function ReadingListItem({ value }: { value: ListItemValue }): JSX.Element {
  const progressValue = parseProgress(value.progress);

  return (
    <ListItem>
      <div
        className={`
          relative
          after:absolute after:top-0 after:left-0 after:z-10 after:size-full
          after:bg-default after:opacity-15 after:transition-opacity
          group-has-[a:hover]/list-item:after:opacity-0
        `}
      >
        <ListItemCover imageProps={value.coverImageProps} />
      </div>
      <div
        className={`
          flex grow flex-col items-start gap-y-1
          tablet:w-full tablet:gap-y-2
          desktop:pr-4
        `}
      >
        <TitleAndProgress
          progress={value.progress}
          reviewed={value.reviewed}
          slug={value.slug}
          title={value.title}
        />
        <Authors
          className="font-sans text-xs font-light text-subtle"
          values={value.authors}
        />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
        <div className="font-sans text-xs leading-4 font-light text-subtle">
          {value.edition}
        </div>

        {value.progress === "Abandoned" ? (
          <div>Abandoned</div>
        ) : (
          <div className="grid grid-cols-[1fr_auto] items-center self-stretch">
            <div className="flex h-[6px] flex-col bg-subtle">
              <BarGradient maxValue={100} value={progressValue} />
            </div>
            <span className="pl-4 font-sans text-xxs text-subtle">
              {value.progress}
            </span>
          </div>
        )}
      </div>
    </ListItem>
  );
}

function TitleAndProgress({
  progress,
  reviewed,
  slug,
  title,
}: {
  progress: ListItemValue["progress"];
  reviewed: ListItemValue["reviewed"];
  slug: ListItemValue["slug"];
  title: ListItemValue["title"];
}) {
  const progressBox = (
    <span className="text-xs font-light text-subtle">{progress}</span>
  );

  if (reviewed) {
    return (
      <span className="flex items-center font-sans text-sm">
        <a
          className={`
            text-sm leading-4 font-medium text-accent
            after:absolute after:top-0 after:left-0 after:z-10 after:size-full
            after:opacity-0
          `}
          href={`/reviews/${slug}/`}
        >
          {title}
        </a>
        &#8239;&#8239;{progressBox}
      </span>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}&#8239;&#8239;{progressBox}
    </span>
  );
}
