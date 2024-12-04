import { type JSX, useReducer } from "react";

import type { CoverImageProps } from "~/api/covers";
import type { TimelineEntry } from "~/api/timelineEntries";

import { SolidBackdrop } from "~/components/Backdrop";
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
  | "sequence"
  | "slug"
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
      backdrop={<SolidBackdrop deck={deck} title="Reading Log" />}
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
      {toSentenceArray(values.map((author) => author.name))}
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
    <li className="relative flex max-w-screen-max flex-col bg-group last-of-type:pb-12 tablet:mb-12 tablet:flex-row tablet:py-4 tablet:pr-4 tablet:last-of-type:pb-4">
      <div className="px-container py-4 tablet:px-4 tablet:pt-11 tablet:text-muted">
        <div className="flex items-center gap-1 tablet:block">
          <div className="text-center text-2xl text-muted tablet:text-2.5xl/8">
            {date}
          </div>
          <div className="ml-1 py-2 font-sans text-xxs/none uppercase text-subtle tablet:ml-0 tablet:w-12 tablet:text-center">
            {day}
          </div>
        </div>
      </div>
      <ul className="flex grow flex-col tablet:my-4 tablet:gap-y-0 tablet:bg-subtle">
        {values.map((value) => {
          return <ReadingListItem key={value.sequence} value={value} />;
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
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col items-start gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <TitleAndProgress
          progress={value.progress}
          reviewed={value.reviewed}
          slug={value.slug}
          title={value.title}
        />
        <Authors
          className="font-sans text-xs leading-5 text-muted"
          values={value.authors}
        />
        <ListItemKindAndYear kind={value.kind} year={value.yearPublished} />
        <div className="font-sans text-xs font-light leading-4 text-subtle">
          {value.edition}
        </div>

        {value.progress === "Abandoned" ? (
          <div>Abandoned</div>
        ) : (
          <div className="grid grid-cols-[1fr,auto] items-center self-stretch">
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
      <a
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-cover before:w-list-item-cover before:bg-[#fff] before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 desktop:before:left-6"
        href={`/reviews/${slug}/`}
      >
        {title}&#8239;&#8239;{progressBox}
      </a>
    );
  }

  return (
    <span className="block font-sans text-sm font-normal text-muted">
      {title}&#8239;&#8239;{progressBox}
    </span>
  );
}
