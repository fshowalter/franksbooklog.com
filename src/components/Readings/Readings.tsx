import { useReducer } from "react";
import type { CoverImageProps } from "src/api/covers";
import type { TimelineEntry } from "src/api/timelineEntries";
import { BarGradient } from "src/components/BarGradient";
import { GroupedList } from "src/components/GroupedList";
import { ListItem } from "src/components/ListItem";
import { ListItemCover } from "src/components/ListItemCover";
import { ListItemKindAndYear } from "src/components/ListItemKindAndYear";
import { ListWithFiltersLayout } from "src/components/ListWithFiltersLayout";
import { ListHeaderButton } from "src/components/ListWithFiltersLayout";
import { toSentenceArray } from "src/utils";

import { SolidBackdrop } from "../Backdrop";
import { Filters } from "./Filters";
import type { Sort } from "./Readings.reducer";
import { Actions, initState, reducer } from "./Readings.reducer";

export interface Props {
  values: ListItemValue[];
  distinctEditions: string[];
  distinctWorkYears: string[];
  distinctKinds: string[];
  distinctReadingYears: string[];
  initialSort: Sort;
  shortStoryCount: number;
  bookCount: number;
  abandonedCount: number;
  workCount: number;
}
export interface ListItemValue
  extends Pick<
    TimelineEntry,
    | "slug"
    | "reviewed"
    | "sequence"
    | "yearPublished"
    | "progress"
    | "title"
    | "edition"
    | "kind"
    | "authors"
  > {
  readingDate: string;
  readingMonth: string;
  readingDay: string;
  readingYear: string;
  coverImageProps: CoverImageProps;
}

export function Readings({
  values,
  distinctEditions,
  distinctKinds,
  distinctReadingYears,
  distinctWorkYears,
  initialSort,
}: Props): JSX.Element {
  const [state, dispatch] = useReducer(
    reducer,
    {
      values,
      initialSort,
    },
    initState,
  );

  return (
    <ListWithFiltersLayout
      backdrop={
        <SolidBackdrop
          title="Reading Log"
          deck={`"It is what you read when you don't have to that determines what you will be when you can't help it."`}
        />
      }
      totalCount={state.filteredValues.length}
      listHeaderButtons={
        <ListHeaderButton href="/readings/stats/" text="stats" />
      }
      filters={
        <Filters
          dispatch={dispatch}
          distinctEditions={distinctEditions}
          distinctKinds={distinctKinds}
          distinctWorkYears={distinctWorkYears}
          distinctReadingYears={distinctReadingYears}
          sortValue={state.sortValue}
        />
      }
      list={
        <GroupedList
          data-testid="list"
          groupedValues={state.groupedValues}
          visibleCount={state.showCount}
          totalCount={state.filteredValues.length}
          onShowMore={() => dispatch({ type: Actions.SHOW_MORE })}
        >
          {(dateGroup) => {
            const [dayAndDate, values] = dateGroup;
            return (
              <DateListItem
                values={values}
                key={dayAndDate}
                dayAndDate={dayAndDate}
              />
            );
          }}
        </GroupedList>
      }
    />
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
    <li className="relative flex max-w-screen-max flex-col gap-2 gap-x-4 first:pt-0 odd:bg-stripe tablet:flex-row tablet:items-center tablet:gap-x-8 tablet:px-4 desktop:px-6">
      <div className="px-container py-1 text-muted tablet:px-0">
        <div className="flex items-center gap-1 tablet:block tablet:shadow-all">
          <div className="py-2 uppercase tablet:w-12 tablet:bg-canvas tablet:text-center tablet:text-sm/none">
            {day}
          </div>
          <div className="text-center text-muted tablet:bg-subtle tablet:text-2.5xl/8">
            {date}
          </div>
        </div>
      </div>
      <ul className="flex grow flex-col tablet:my-4 tablet:gap-y-0 tablet:bg-subtle">
        {values.map((value) => {
          return <ReadingListItem value={value} key={value.sequence} />;
        })}
      </ul>
    </li>
  );
}
function ReadingListItem({ value }: { value: ListItemValue }): JSX.Element {
  const progressValue = parseProgress(value.progress);

  return (
    <ListItem>
      <ListItemCover imageProps={value.coverImageProps} />
      <div className="flex grow flex-col items-start gap-y-1 tablet:w-full tablet:gap-y-2 desktop:pr-4">
        <TitleAndProgress
          title={value.title}
          progress={value.progress}
          reviewed={value.reviewed}
          slug={value.slug}
        />
        <Authors
          values={value.authors}
          className="font-sans text-xs leading-5 text-muted"
        />
        <ListItemKindAndYear year={value.yearPublished} kind={value.kind} />
        <div className="font-sans text-xs font-light leading-4 text-subtle">
          {value.edition}
        </div>

        {value.progress === "Abandoned" ? (
          <div>Abandoned</div>
        ) : (
          <div className="grid grid-cols-[1fr,auto] items-center self-stretch">
            <div className="flex h-[6px] flex-col bg-subtle">
              <BarGradient value={progressValue} maxValue={100} />
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

function parseProgress(progress: string) {
  const progressNumber = progress.split("%", 1)[0];

  if (progressNumber === "Finished") {
    return 100;
  }

  if (!isNaN(Number(progressNumber))) {
    return parseInt(progressNumber);
  }

  return 100;
}

function TitleAndProgress({
  title,
  progress,
  reviewed,
  slug,
}: {
  title: ListItemValue["title"];
  progress: ListItemValue["progress"];
  reviewed: ListItemValue["reviewed"];
  slug: ListItemValue["slug"];
}) {
  const progressBox = (
    <span className="text-xs font-light text-subtle">{progress}</span>
  );

  if (reviewed) {
    return (
      <a
        href={`/reviews/${slug}/`}
        className="block font-sans text-sm font-medium text-accent decoration-accent decoration-2 underline-offset-4 before:absolute before:left-[var(--container-padding)] before:top-4 before:aspect-cover before:w-list-item-cover before:bg-[#fff] before:opacity-15 hover:underline hover:before:opacity-0 tablet:before:left-4 desktop:before:left-6"
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

function Authors({
  values,
  className,
}: {
  values: ListItemValue["authors"];
  className: string;
}) {
  return (
    <div className={className}>
      {toSentenceArray(values.map((author) => author.name))}
    </div>
  );
}
